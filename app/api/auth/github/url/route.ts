import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const redirectUri = `${process.env.APP_URL}/api/auth/github/callback`;

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID || '',
    redirect_uri: redirectUri,
    scope: 'user:email',
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params}`;

  return NextResponse.json({ url: authUrl });
}
