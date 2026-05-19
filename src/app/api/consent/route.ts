import { NextRequest, NextResponse } from 'next/server';
import { saveCookieConsent } from '@/src/lib/db';
import type { CookiePreferences } from '@/src/types/crm';
import { getSessionIdFromRequest } from '@/src/lib/session';
import {
  consumeRateLimit,
  getClientIp,
  getRetryAfterSeconds,
  RateLimitProviderUnavailableError,
} from '@/src/lib/anti-abuse';

export async function POST(request: NextRequest) {
  const sessionId = getSessionIdFromRequest(request.headers.get('x-session-id'));
  if (!sessionId) {
    return NextResponse.json({ error: 'Session id required' }, { status: 400 });
  }

  try {
    const clientIp = getClientIp(request);
    const limit = await consumeRateLimit({
      key: `consent:${clientIp}`,
      limit: 30,
      windowMs: 60 * 1000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(getRetryAfterSeconds(limit.retryAfterMs)) } }
      );
    }

    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (typeof body.analytics !== 'boolean' || typeof body.marketing !== 'boolean') {
      return NextResponse.json({ error: 'Invalid consent payload' }, { status: 400 });
    }

    const preferences: CookiePreferences = {
      essential: true,
      analytics: body.analytics,
      marketing: body.marketing,
      timestamp: new Date().toISOString(),
    };

    await saveCookieConsent(sessionId, preferences);
    return NextResponse.json({ success: true, storedAt: preferences.timestamp });
  } catch (e) {
    if (e instanceof RateLimitProviderUnavailableError) {
      return NextResponse.json(
        {
          error:
            'Anti-abuse provider unavailable in production. Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.',
        },
        { status: e.statusCode }
      );
    }

    console.error('[api/consent]', e);
    return NextResponse.json({ error: 'Failed to save consent' }, { status: 500 });
  }
}
