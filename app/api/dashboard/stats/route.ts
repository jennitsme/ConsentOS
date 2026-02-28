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
    
    // Calculate data points based on activity (real data logic)
    const dataPoints = activityCount * 150;

    return NextResponse.json({
      activePermissions: activePermissions,
      dataPoints: dataPoints
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
