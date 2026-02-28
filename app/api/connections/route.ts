import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, status, type } = body;

    if (!provider || !status) {
      return NextResponse.json({ error: 'Provider and status are required' }, { status: 400 });
    }

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'dummy@example.com',
          name: 'Dummy User',
          provider: 'email',
        }
      });
    }

    // Helper to get default privacy scores and data counts
    const getProviderDefaults = (provider: string) => {
      const defaults: Record<string, { score: number, count: number }> = {
        'Google Workspace': { score: 85, count: 1240 },
        'Twitter / X': { score: 62, count: 432 },
        'Dropbox': { score: 78, count: 850 },
        'Meta': { score: 45, count: 2100 },
        'GitHub': { score: 92, count: 156 },
        'LinkedIn': { score: 70, count: 320 },
        'Spotify': { score: 80, count: 540 },
      };
      return defaults[provider] || { score: 50, count: 100 };
    };

    const { score, count } = getProviderDefaults(provider);

    // Upsert connection: update jika sudah ada, create jika belum
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

    // Tambahkan log aktivitas bahwa user menyambungkan akun
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        appName: provider,
        action: `Connected ${provider} account`,
        status: status === 'connected' ? 'approved' : 'active',
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

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        appName: provider,
        action: `Disconnected ${provider} account`,
        status: 'blocked',
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

    return NextResponse.json({ connections });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}
