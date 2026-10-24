import { SignJWT, jwtVerify } from 'jose';

export const COOKIE_NAME = 'fotolab_session';

function getSessionSecret() {
  return process.env.SESSION_SECRET || 'development-session-secret-for-fotolab-123456';
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export function isValidAdminCredentials(username: string, password: string) {
  const expectedUsername = (process.env.ADMIN_USERNAME ?? '1533').trim();
  const expectedPassword = (process.env.ADMIN_PASSWORD ?? '1533').trim();

  return username.trim() === expectedUsername && password.trim() === expectedPassword;
}

export async function createSessionToken() {
  const secret = new TextEncoder().encode(getSessionSecret());

  return new SignJWT({
    sub: 'admin',
    username: process.env.ADMIN_USERNAME ?? '1533',
    role: 'admin',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret);
}

export async function verifySession(token: string | undefined) {
  if (!token) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(getSessionSecret()));
    return payload.sub === 'admin' && payload.role === 'admin';
  } catch {
    return false;
  }
}
