import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  // The redirect_uri must match exactly what was sent in the /url endpoint
  const redirectUri = `${origin}/api/auth/google/callback`;

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
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials not configured');
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange error:', tokenData);
      throw new Error(tokenData.error_description || 'Failed to exchange token');
    }

    // Get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    // Save to database
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userInfo.email || 'dummy@example.com',
          name: userInfo.name || 'Dummy User',
          provider: 'email',
        }
      });
    }

    await prisma.connection.upsert({
      where: {
        userId_provider: {
          userId: user.id,
          provider: 'Google Workspace',
        }
      },
      update: {
        status: 'connected',
        type: 'Email, Docs, Drive',
        lastSync: new Date(),
      },
      create: {
        userId: user.id,
        provider: 'Google Workspace',
        status: 'connected',
        type: 'Email, Docs, Drive',
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        appName: 'Google Workspace',
        action: `Connected Google account (${userInfo.email})`,
        status: 'approved',
      }
    });

    // Send success message to parent window and close popup
    return new NextResponse(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', provider: 'Google Workspace' }, '*');
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
