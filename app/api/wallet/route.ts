import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'user@example.com',
          name: 'Default User',
          provider: 'email',
        }
      });
    }

    // Initialize with some dummy transactions if none exist
    const txCount = await prisma.transaction.count({ where: { userId: user.id } });
    if (txCount === 0) {
      await prisma.transaction.createMany({
        data: [
          { userId: user.id, type: 'payment', source: 'Anthropic Claude', amount: 1.20, status: 'completed', createdAt: new Date() },
          { userId: user.id, type: 'payment', source: 'OpenAI (GPT-4)', amount: 5.50, status: 'completed', createdAt: new Date(Date.now() - 86400000) },
          { userId: user.id, type: 'withdrawal', source: 'Bank Account ending in 4211', amount: -50.00, status: 'completed', createdAt: new Date(Date.now() - 86400000 * 2) },
          { userId: user.id, type: 'payment', source: 'Midjourney', amount: 0.80, status: 'completed', createdAt: new Date(Date.now() - 86400000 * 3) },
        ]
      });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    const totalBalance = transactions.reduce((acc, tx) => acc + tx.amount, 0);
    
    // Calculate monthly earnings (only payments)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyEarnings = transactions
      .filter(tx => tx.type === 'payment' && tx.createdAt >= firstDayOfMonth)
      .reduce((acc, tx) => acc + tx.amount, 0);

    // Get top earning sources
    const sourcesMap: Record<string, number> = {};
    transactions.filter(tx => tx.type === 'payment').forEach(tx => {
      sourcesMap[tx.source] = (sourcesMap[tx.source] || 0) + tx.amount;
    });
    
    const topSources = Object.entries(sourcesMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    const activeContracts = await prisma.dataCategory.count({
      where: { userId: user.id, level: 'monetized' }
    });

    return NextResponse.json({
      balance: totalBalance,
      monthlyEarnings,
      activeContracts,
      topSources,
      transactions
    });
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { amount, source } = await request.json();
    const user = await prisma.user.findFirst();
    if (!user) throw new Error('User not found');

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'withdrawal',
        source: source || 'External Wallet',
        amount: -Math.abs(amount),
        status: 'completed'
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        appName: 'Wallet',
        action: `Withdrew $${Math.abs(amount).toFixed(2)} to ${source}`,
        status: 'active'
      }
    });

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    return NextResponse.json({ error: 'Failed to process withdrawal' }, { status: 500 });
  }
}
