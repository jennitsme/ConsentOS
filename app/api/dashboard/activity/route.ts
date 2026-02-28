import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ activity: [] });
    }

    const activity = await prisma.activityLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Jika database masih kosong, kita bisa kembalikan data dummy sementara
    if (activity.length === 0) {
      return NextResponse.json({
        activity: [
          { id: '1', appName: 'OpenAI', action: 'Requested access to public tweets', status: 'approved', createdAt: new Date() },
          { id: '2', appName: 'Midjourney', action: 'Requested access to email address', status: 'denied', createdAt: new Date(Date.now() - 3600000) },
          { id: '3', appName: 'Notion', action: 'Requested access to calendar events', status: 'active', createdAt: new Date(Date.now() - 7200000) },
        ]
      });
    }

    return NextResponse.json({ activity });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
