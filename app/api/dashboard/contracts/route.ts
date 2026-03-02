import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ contracts: [] });
    }

    let permissions = await prisma.permission.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // If no permissions exist, create some dummy ones for demonstration
    if (permissions.length === 0) {
      const dummyPermissions = [
        { appName: 'Anthropic', status: 'active', consentHash: '0x8f...3d2a' },
        { appName: 'OpenAI', status: 'active', consentHash: '0x1a...9b4c' },
        { appName: 'Midjourney', status: 'revoked', consentHash: '0x4c...2e1f' },
        { appName: 'Grammarly', status: 'expired', consentHash: '0x9d...7a5b' },
      ];

      for (const p of dummyPermissions) {
        await prisma.permission.create({
          data: {
            userId: user.id,
            appName: p.appName,
            status: p.status,
            consentHash: p.consentHash,
          }
        });
      }

      permissions = await prisma.permission.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ contracts: permissions });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 });
  }
}
