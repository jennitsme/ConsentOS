import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { solanaService } from '@/lib/solana';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return new NextResponse('Missing code', { status: 400 });
  }

  const redirectUri = `${process.env.APP_URL}/api/auth/github/callback`;

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub OAuth error:', tokenData);
      throw new Error(tokenData.error_description || 'OAuth error');
    }

    const accessToken = tokenData.access_token;

    // Fetch user profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();

    // Fetch user repositories count as an example of real data
    const reposResponse = await fetch('https://api.github.com/user/repos?per_page=1', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    // GitHub API returns pagination info in the Link header which we can use to get total count
    // For simplicity, we'll just use public_repos from user profile + private if available
    const dataCount = userData.public_repos + (userData.total_private_repos || 0);

    // Save to database
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userData.email || `${userData.login}@github.com`,
          name: userData.name || userData.login,
          provider: 'github',
        }
      });
    }

    await prisma.connection.upsert({
      where: {
        userId_provider: {
          userId: user.id,
          provider: 'GitHub',
        }
      },
      update: {
        status: 'connected',
        type: 'Code Repositories, Issues',
        accessToken: accessToken,
        dataCount: dataCount,
        privacyScore: 92, // Static for now, could be dynamic based on scopes
        lastSync: new Date(),
      },
      create: {
        userId: user.id,
        provider: 'GitHub',
        status: 'connected',
        type: 'Code Repositories, Issues',
        accessToken: accessToken,
        dataCount: dataCount,
        privacyScore: 92,
      }
    });

    // Record on Solana
    const solanaSignature = await solanaService.recordConsentOnChain(user.id, 'GitHub', 'connected');

    // Create a Permission (Contract) for this connection
    const existingPermission = await prisma.permission.findFirst({
      where: { userId: user.id, appName: 'GitHub' }
    });

    if (existingPermission) {
      await prisma.permission.update({
        where: { id: existingPermission.id },
        data: { status: 'active', solanaSignature }
      });
    } else {
      await prisma.permission.create({
        data: {
          userId: user.id,
          appName: 'GitHub',
          status: 'active',
          solanaSignature
        }
      });
    }

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        appName: 'GitHub',
        action: `Connected GitHub account (@${userData.login})`,
        status: 'approved',
        solanaSignature
      }
    });

    // Set auth session cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_session', JSON.stringify({ 
      name: userData.name || userData.login, 
      provider: 'github' 
    }), {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Send success message to parent window and close popup
    return new NextResponse(`
      <script>
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', provider: 'GitHub' }, '*');
          window.close();
        } else {
          window.location.href = '/dashboard';
        }
      </script>
      <p>Authentication successful. This window should close automatically.</p>
    `, { headers: { 'Content-Type': 'text/html' } });

  } catch (error: any) {
    console.error('Error during GitHub callback:', error);
    return new NextResponse(`
      <script>
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${error.message}' }, '*');
          window.close();
        }
      </script>
    `, { headers: { 'Content-Type': 'text/html' } });
  }
}
