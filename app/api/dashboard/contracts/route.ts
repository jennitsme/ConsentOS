import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    let user = await getCurrentUser();
    if (!user) {
      user = await prisma.user.findFirst();
      if (!user) {
        return NextResponse.json({ contracts: [] });
      }
    }

    let permissions = await prisma.permission.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ contracts: permissions });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 });
  }
}
