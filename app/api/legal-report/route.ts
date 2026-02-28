import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

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

    if (format === 'csv') {
      let csv = 'Timestamp,App/Source,Action,Status,Consent Hash\n';
      activity.forEach(a => {
        // Extract hash from action if present
        const hashMatch = a.action.match(/Contract Hash: (.*)\.\.\./);
        const hash = hashMatch ? hashMatch[1] : 'N/A';
        const cleanAction = a.action.replace(/,/, ';'); // Basic CSV escaping
        csv += `${a.createdAt.toISOString()},${a.appName},${cleanAction},${a.status},${hash}\n`;
      });

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="ConsentOS-Audit-Trail-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

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
        price: p.price,
        consentHash: p.consentHash
      })),
      activityLogs: activity.map(a => ({
        timestamp: a.createdAt,
        app: a.appName,
        action: a.action,
        status: a.status
      }))
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error generating legal report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
