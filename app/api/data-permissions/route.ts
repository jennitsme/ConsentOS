import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateConsentHash } from '@/lib/hashing';
import { solanaService } from '@/lib/solana';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    let user = await getCurrentUser();
    if (!user) {
      user = await prisma.user.findFirst();
      if (!user) {
        return NextResponse.json({ categories: [] });
      }
    }

    const categories = await prisma.dataCategory.findMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching data permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, level, price, walletAddress, signature } = await request.json();
    let user = await getCurrentUser();
    
    if (!user) {
      user = await prisma.user.findFirst();
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }

    const current = await prisma.dataCategory.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const newHash = generateConsentHash(user.id, current.name, level);

    // Record on Solana
    const solanaSignature = await solanaService.recordConsentOnChain(user.id, current.name, newHash);

    const updated = await prisma.dataCategory.update({
      where: { id },
      data: {
        level,
        price: price !== undefined ? parseFloat(price) : undefined,
        consentHash: newHash,
        solanaSignature
      }
    });

    // Log the activity with wallet signature proof
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        appName: updated.source,
        action: `Updated permission for ${updated.name} to ${level}. Signed by ${walletAddress ? walletAddress.substring(0, 8) + '...' : 'User'}.`,
        status: level === 'denied' ? 'blocked' : 'active',
        solanaSignature: signature || solanaSignature // Store the user's signature or the on-chain tx
      }
    });

    return NextResponse.json({ category: updated });
  } catch (error) {
    console.error('Error updating data permission:', error);
    return NextResponse.json({ error: 'Failed to update permission' }, { status: 500 });
  }
}
