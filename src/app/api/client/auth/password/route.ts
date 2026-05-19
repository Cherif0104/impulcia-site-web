import { NextRequest, NextResponse } from 'next/server';
import { consumeClientPasswordToken } from '@/src/lib/client-auth';
import { sanitizeText } from '@/src/lib/anti-abuse';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = sanitizeText(body.token, 2000);
    const password = String(body.password || '');
    if (!token || password.length < 8) {
      return NextResponse.json({ error: 'token and strong password are required' }, { status: 400 });
    }
    const ok = await consumeClientPasswordToken(token, password);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
