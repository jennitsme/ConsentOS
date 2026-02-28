import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    // Set a simple session cookie
    response.cookies.set('auth_session', JSON.stringify({ name: address, provider: 'wallet' }), {
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
