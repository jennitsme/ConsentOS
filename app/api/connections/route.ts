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
        lastSync: new Date(),
      },
      create: {
        userId: user.id,
        provider: provider,
        status: status,
        type: type || 'General',
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
