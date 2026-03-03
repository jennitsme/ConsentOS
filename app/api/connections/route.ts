import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { solanaService } from '@/lib/solana';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, status, type } = body;

    if (!provider || !status) {
      return NextResponse.json({ error: 'Provider and status are required' }, { status: 400 });
    }

    let user = await getCurrentUser();
    if (!user) {
      user = await prisma.user.findFirst();
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }

    // Helper to get default privacy scores and data counts
    const getProviderDefaults = (provider: string) => {
      const defaults: Record<string, { score: number, count: number, categories: any[] }> = {
        'Google Workspace': { 
          score: 85, 
          count: 1240,
          categories: [
            { name: 'Email Metadata', description: 'Sender, recipient, and timestamps of emails', level: 'restricted', price: 0.2 },
            { name: 'Document Content', description: 'Text content from Google Docs', level: 'denied', price: 0 }
          ]
        },
        'Twitter / X': { 
          score: 62, 
          count: 432,
          categories: [
            { name: 'Public Tweets', description: 'All public text posts on Twitter/X', level: 'monetized', price: 0.5 },
            { name: 'Direct Messages', description: 'Private messages sent and received', level: 'denied', price: 0 }
          ]
        },
        'GitHub': { 
          score: 92, 
          count: 156,
          categories: [
            { name: 'Public Repos', description: 'Public code repositories', level: 'monetized', price: 0.8 },
            { name: 'Commit History', description: 'Metadata about code contributions', level: 'restricted', price: 0.3 }
          ]
        },
      };
      return defaults[provider] || { score: 50, count: 100, categories: [] };
    };

    const { score, count, categories } = getProviderDefaults(provider);

    // Upsert connection
    const connection = await prisma.connection.upsert({
      where: {
        userId_provider: {
          userId: user.id,
          provider: provider,
        }
      },
      update: {
        status: status,
        type: type || 'General',
        privacyScore: score,
        dataCount: count,
        lastSync: new Date(),
      },
      create: {
        userId: user.id,
        provider: provider,
        status: status,
        type: type || 'General',
        privacyScore: score,
        dataCount: count,
      }
    });

    // Create associated data categories if they don't exist
    if (status === 'connected' && categories.length > 0) {
      for (const cat of categories) {
        const existing = await prisma.dataCategory.findUnique({
          where: { userId_name: { userId: user.id, name: cat.name } }
        });
        
        if (!existing) {
          const consentHash = generateConsentHash(user.id, cat.name, cat.level);
          await prisma.dataCategory.create({
            data: {
              userId: user.id,
              name: cat.name,
              description: cat.description,
              source: provider,
              level: cat.level,
              price: cat.price,
              consentHash
            }
          });
        }
      }
    }

    // Record on Solana
    const solanaSignature = await solanaService.recordConsentOnChain(user.id, provider, status);

    // Tambahkan log aktivitas bahwa user menyambungkan akun
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        appName: provider,
        action: `Connected ${provider} account`,
        status: status === 'connected' ? 'approved' : 'active',
        solanaSignature
      }
    });

    return NextResponse.json({ success: true, connection });
  } catch (error) {
    console.error('Error updating connection:', error);
    return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { provider } = body;

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.connection.delete({
      where: {
        userId_provider: {
          userId: user.id,
          provider: provider,
        }
      }
    });

    // Record on Solana
    const solanaSignature = await solanaService.recordConsentOnChain(user.id, provider, 'disconnected');

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        appName: provider,
        action: `Disconnected ${provider} account`,
        status: 'blocked',
        solanaSignature
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting connection:', error);
    return NextResponse.json({ error: 'Failed to delete connection' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ connections: [] });
    }

    const connections = await prisma.connection.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' }
    });

    // Attempt to refresh data counts for connections with access tokens
    const updatedConnections = await Promise.all(connections.map(async (conn) => {
      // Only refresh if it's been more than an hour since last sync to avoid rate limits
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      if (conn.accessToken && conn.lastSync < oneHourAgo) {
        try {
          if (conn.provider === 'GitHub') {
            const userResponse = await fetch('https://api.github.com/user', {
              headers: { Authorization: `Bearer ${conn.accessToken}` },
            });
            if (userResponse.ok) {
              const userData = await userResponse.json();
              const newDataCount = userData.public_repos + (userData.total_private_repos || 0);
              
              if (newDataCount !== conn.dataCount) {
                const updatedConn = await prisma.connection.update({
                  where: { id: conn.id },
                  data: { dataCount: newDataCount, lastSync: new Date() }
                });
                return updatedConn;
              }
            }
          } else if (conn.provider === 'Twitter / X') {
            const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=public_metrics', {
              headers: { Authorization: `Bearer ${conn.accessToken}` },
            });
            if (userResponse.ok) {
              const userData = await userResponse.json();
              const newDataCount = userData.data?.public_metrics?.tweet_count || conn.dataCount;
              
              if (newDataCount !== conn.dataCount) {
                const updatedConn = await prisma.connection.update({
                  where: { id: conn.id },
                  data: { dataCount: newDataCount, lastSync: new Date() }
                });
                return updatedConn;
              }
            }
          }
        } catch (error) {
          console.error(`Failed to refresh data for ${conn.provider}:`, error);
        }
      }
      return conn;
    }));

    return NextResponse.json({ connections: updatedConnections });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}
