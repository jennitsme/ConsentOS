import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST() {
  try {
    let user = await getCurrentUser();
    if (!user) {
      user = await prisma.user.findFirst();
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }

    // Find all monetized categories for this user
    const monetizedCategories = await prisma.dataCategory.findMany({
      where: {
        userId: user.id,
        level: 'monetized'
      }
    });

    if (monetizedCategories.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No monetized categories found. Set some categories to "Monetized" to earn.',
        transactions: [] 
      });
    }

    const newTransactions = [];
    const buyers = ['OpenAI', 'Anthropic', 'Midjourney', 'Meta AI', 'Google DeepMind'];

    for (const cat of monetizedCategories) {
      // Randomly decide if this category was used by 1-2 buyers
      const numBuyers = Math.floor(Math.random() * 2) + 1;
      const selectedBuyers = [...buyers].sort(() => 0.5 - Math.random()).slice(0, numBuyers);

      for (const buyer of selectedBuyers) {
        // Amount is based on price + some random variance
        const basePrice = cat.price || 0.5;
        const amount = parseFloat((basePrice * (0.8 + Math.random() * 0.4)).toFixed(2));

        if (amount > 0) {
          const tx = await prisma.transaction.create({
            data: {
              userId: user.id,
              type: 'payment',
              source: `${buyer} (${cat.name})`,
              amount: amount,
              status: 'completed'
            }
          });
          newTransactions.push(tx);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully processed ${newTransactions.length} data usage payments.`,
      transactions: newTransactions 
    });
  } catch (error) {
    console.error('Error simulating data usage:', error);
    return NextResponse.json({ error: 'Failed to simulate data usage' }, { status: 500 });
  }
}
