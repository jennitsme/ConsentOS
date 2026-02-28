import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Menggunakan user pertama sebagai dummy user sementara
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

    const activePermissions = await prisma.permission.count({
      where: {
        userId: user.id,
        status: { in: ['approved', 'active'] }
      }
    });

    const activityCount = await prisma.activityLog.count({
      where: { userId: user.id }
    });

    const connections = await prisma.connection.findMany({
      where: { userId: user.id }
    });

    const totalDataPoints = connections.reduce((acc, conn) => acc + conn.dataCount, 0);
    const avgPrivacyScore = connections.length > 0 
      ? Math.round(connections.reduce((acc, conn) => acc + conn.privacyScore, 0) / connections.length)
      : 0;
    
    // Fallback to activity-based calculation if no connections
    const dataPoints = totalDataPoints || (activityCount * 150);

    return NextResponse.json({
      activePermissions: activePermissions,
      dataPoints: dataPoints,
      privacyScore: avgPrivacyScore
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
