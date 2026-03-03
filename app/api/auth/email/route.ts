import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
          provider: 'email',
        }
      });
    }

    const response = NextResponse.json({ success: true });

    // Set a robust session cookie including the user ID
    response.cookies.set('auth_session', JSON.stringify({ 
      id: user.id,
      name: user.name, 
      provider: 'email' 
    }), {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('Error during email login:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
