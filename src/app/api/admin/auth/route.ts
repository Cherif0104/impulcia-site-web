import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  ADMIN_ROLE_COOKIE,
  getAdminDefaultRole,
  getAdminSecret,
  getAdminSessionToken,
  verifyAdminPassword,
} from '@/src/lib/admin-auth';

export async function POST(request: NextRequest) {
  if (!getAdminSecret()) {
    return NextResponse.json(
      { error: 'ADMIN_SECRET is not configured on the server' },
      { status: 503 }
    );
  }

  try {
    const { password } = await request.json();
    if (!password || !verifyAdminPassword(String(password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, getAdminSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set(ADMIN_ROLE_COOKIE, getAdminDefaultRole(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  response.cookies.set(ADMIN_ROLE_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
