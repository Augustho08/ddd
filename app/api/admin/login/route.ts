import { NextResponse } from 'next/server';
import { COOKIE_NAME, createSessionToken, isValidAdminCredentials } from '@/lib/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const username = String(body.username ?? '');
  const password = String(body.password ?? '');

  if (!isValidAdminCredentials(username, password)) {
    return Response.json({ ok: false, error: 'Credenciais inválidas' }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true, action: 'admin-login' });

  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return response;
}
