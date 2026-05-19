import { NextRequest, NextResponse } from 'next/server';
import { authenticateClient, buildClientSessionToken, CLIENT_COOKIE, readClientSession } from '@/src/lib/client-auth';
import { sanitizeText } from '@/src/lib/anti-abuse';

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function GET() {
  const session = await readClientSession();
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, session });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = sanitizeText(body.email, 160).toLowerCase();
    const password = String(body.password || '');
    if (!email || !password) {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
    }

    const result = await authenticateClient(email, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(CLIENT_COOKIE, buildClientSessionToken(result.session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ONE_WEEK,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(CLIENT_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
