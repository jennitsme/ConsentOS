import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 1. Delete all connections
    const deletedConnections = await prisma.connection.deleteMany({
      where: { userId: user.id }
    });

    // 2. Set all data permissions to 'denied'
    const updatedPermissions = await prisma.dataCategory.updateMany({
      where: { userId: user.id },
      data: { level: 'denied' }
    });

    // 3. Log the massive revocation
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        appName: 'System',
        action: 'REVOKED ALL DATA ACCESS AND CONNECTIONS',
        status: 'blocked'
      }
    });

    return NextResponse.json({ 
      message: 'All access revoked successfully',
      connectionsRevoked: deletedConnections.count,
      permissionsReset: updatedPermissions.count
    });
  } catch (error) {
    console.error('Error revoking all access:', error);
    return NextResponse.json({ error: 'Failed to revoke all access' }, { status: 500 });
  }
}
