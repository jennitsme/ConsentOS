import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  const redirectUri = `${origin}/api/auth/twitter/callback`;

  if (error) {
    return new NextResponse(`
      <html><body><script>
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${error}' }, '*');
          window.close();
        }
      </script></body></html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }

  if (!code) {
    return new NextResponse('No code provided', { status: 400 });
  }

  try {
    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Twitter OAuth credentials not configured');
    }

    const cookieStore = await cookies();
    const codeVerifier = cookieStore.get('twitter_code_verifier')?.value;

    if (!codeVerifier) {
      throw new Error('Code verifier not found. Session may have expired.');
    }

    // Twitter requires Basic Auth header for confidential clients
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange error:', tokenData);
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange token');
    }

    // Get user info
    const userInfoResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfoData = await userInfoResponse.json();
    const userInfo = userInfoData.data;

    // Save to database
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userInfo.username ? `${userInfo.username}@twitter.com` : 'dummy@example.com',
          name: userInfo.name || 'Dummy User',
          provider: 'email',
        }
      });
    }

    await prisma.connection.upsert({
      where: {
        userId_provider: {
          userId: user.id,
          provider: 'Twitter / X',
        }
      },
      update: {
        status: 'connected',
        type: 'Social Posts, Interactions',
        lastSync: new Date(),
      },
      create: {
        userId: user.id,
        provider: 'Twitter / X',
        status: 'connected',
        type: 'Social Posts, Interactions',
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        appName: 'Twitter / X',
        action: `Connected Twitter account (@${userInfo.username})`,
        status: 'approved',
      }
    });

    // Send success message to parent window and close popup
    return new NextResponse(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', provider: 'Twitter / X' }, '*');
              window.close();
            } else {
              window.location.href = '/dashboard';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });

  } catch (err: any) {
    console.error('OAuth callback error:', err);
    return new NextResponse(`
      <html><body><script>
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${err.message}' }, '*');
          window.close();
        }
      </script></body></html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }
}
