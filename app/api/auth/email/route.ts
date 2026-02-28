import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    // Set a simple session cookie
    response.cookies.set('auth_session', JSON.stringify({ name: email, provider: 'email' }), {
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
