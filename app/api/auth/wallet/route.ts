import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
    }

    // Find or create user by wallet address (providerId)
    let user = await prisma.user.findUnique({
      where: { providerId: address }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: `${address.substring(0, 4)}...${address.substring(address.length - 4)}`,
          provider: 'wallet',
          providerId: address,
        }
      });
    }

    const response = NextResponse.json({ success: true });

    // Set a robust session cookie including the user ID
    response.cookies.set('auth_session', JSON.stringify({ 
      id: user.id,
      name: user.name, 
      provider: 'wallet' 
    }), {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('Error during wallet login:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
