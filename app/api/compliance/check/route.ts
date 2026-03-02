import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * AI Compliance API
 * Endpoint: /api/compliance/check
 * Method: GET
 * Query Params: 
 *   - identifier: User email or identifier
 *   - category: Data category name (e.g., 'Public Tweets', 'Code Repositories')
 * 
 * Returns: Permission status and cryptographic proof (Solana signature)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get('identifier');
    const categoryName = searchParams.get('category');

    if (!identifier || !categoryName) {
      return NextResponse.json({ 
        error: 'Missing required parameters: identifier and category' 
      }, { status: 400 });
    }

    // Find user by email or name
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { name: identifier }
        ]
      }
    });

    if (!user) {
      return NextResponse.json({ 
        status: 'unknown',
        message: 'User not found in ConsentOS registry' 
      }, { status: 404 });
    }

    // Find the specific data category permission
    const category = await prisma.dataCategory.findFirst({
      where: {
        userId: user.id,
        name: {
          contains: categoryName,
          // mode: 'insensitive' // Prisma SQLite doesn't support insensitive mode directly in some versions, but we'll try simple match
        }
      }
    });

    if (!category) {
      return NextResponse.json({ 
        status: 'denied',
        message: `No specific permission found for category: ${categoryName}. Defaulting to Denied.` 
      });
    }

    return NextResponse.json({
      status: category.level, // 'denied', 'restricted', 'monetized'
      user: user.name,
      category: category.name,
      compliance: {
        consentHash: category.consentHash,
        solanaSignature: category.solanaSignature,
        lastUpdated: category.updatedAt,
        proofUrl: category.solanaSignature 
          ? `https://explorer.solana.com/tx/${category.solanaSignature}` 
          : null
      },
      monetization: category.level === 'monetized' ? {
        pricePer1k: category.price,
        currency: 'USDC'
      } : null
    });

  } catch (error) {
    console.error('Compliance API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
