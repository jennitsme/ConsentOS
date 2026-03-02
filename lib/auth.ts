import { cookies } from 'next/headers';
import { prisma } from './prisma';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session');

  if (!sessionCookie) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    if (!session.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: session.id }
    });

    return user;
  } catch (error) {
    return null;
  }
}
