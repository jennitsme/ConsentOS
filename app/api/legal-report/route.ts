import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const connections = await prisma.connection.findMany({
      where: { userId: user.id }
    });

    const permissions = await prisma.dataCategory.findMany({
      where: { userId: user.id }
    });

    const activity = await prisma.activityLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    const report = {
      generatedAt: new Date().toISOString(),
      user: {
        name: user.name,
        email: user.email
      },
      summary: {
        totalConnections: connections.length,
        activePermissions: permissions.filter(p => p.level !== 'denied').length,
        totalActivityLogs: activity.length
      },
      connections: connections.map(c => ({
        provider: c.provider,
        type: c.type,
        status: c.status,
        privacyScore: c.privacyScore,
        dataCount: c.dataCount,
        lastSync: c.lastSync
      })),
      permissions: permissions.map(p => ({
        category: p.name,
        level: p.level,
        source: p.source,
        price: p.price
      })),
      activityLogs: activity.map(a => ({
        timestamp: a.createdAt,
        app: a.appName,
        action: a.action,
        status: a.status
      }))
    };

    // Return as JSON for now, frontend can convert to CSV/Text if needed
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error generating legal report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
