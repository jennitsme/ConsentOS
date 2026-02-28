import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateConsentHash } from '@/lib/hashing';

const INITIAL_CATEGORIES = [
  { name: 'Public Tweets', description: 'All public text posts on Twitter/X', source: 'Twitter', level: 'monetized', price: 0.5 },
  { name: 'Private Photos', description: 'Photos stored in Google Photos', source: 'Google', level: 'denied', price: 0 },
  { name: 'Voice Notes', description: 'Audio recordings from WhatsApp', source: 'Meta', level: 'denied', price: 0 },
  { name: 'Code Repositories', description: 'Public code on GitHub', source: 'GitHub', level: 'restricted', price: 0 },
  { name: 'Blog Posts', description: 'Articles published on Medium', source: 'Medium', level: 'monetized', price: 1.2 },
];

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

    let categories = await prisma.dataCategory.findMany({
      where: { userId: user.id }
    });

    // Initialize if empty
    if (categories.length === 0) {
      await Promise.all(INITIAL_CATEGORIES.map(cat => 
        prisma.dataCategory.create({
          data: {
            ...cat,
            userId: user.id!,
            consentHash: generateConsentHash(user.id!, cat.name, cat.level)
          }
        })
      ));
      categories = await prisma.dataCategory.findMany({
        where: { userId: user.id }
      });
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching data permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, level, price } = await request.json();
    const user = await prisma.user.findFirst();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const current = await prisma.dataCategory.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const newHash = generateConsentHash(user.id, current.name, level);

    const updated = await prisma.dataCategory.update({
      where: { id },
      data: {
        level,
        price: price !== undefined ? parseFloat(price) : undefined,
        consentHash: newHash
      }
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        appName: updated.source,
        action: `Updated permission for ${updated.name} to ${level}. Contract Hash: ${newHash.substring(0, 12)}...`,
        status: level === 'denied' ? 'blocked' : 'active',
      }
    });

    return NextResponse.json({ category: updated });
  } catch (error) {
    console.error('Error updating data permission:', error);
    return NextResponse.json({ error: 'Failed to update permission' }, { status: 500 });
  }
}
