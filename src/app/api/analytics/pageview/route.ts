import { NextRequest, NextResponse } from 'next/server';
import { recordPageView } from '@/src/lib/db';
import { getSessionIdFromRequest } from '@/src/lib/session';
import {
  consumeRateLimit,
  getClientIp,
  getRetryAfterSeconds,
  RateLimitProviderUnavailableError,
  sanitizeText,
} from '@/src/lib/anti-abuse';

export async function POST(request: NextRequest) {
  const consent = request.headers.get('x-analytics-consent');
  if (consent !== 'granted') {
    return NextResponse.json({ error: 'Analytics consent required' }, { status: 403 });
  }

  const sessionId = getSessionIdFromRequest(request.headers.get('x-session-id'));
  if (!sessionId) {
    return NextResponse.json({ error: 'Session id required' }, { status: 400 });
  }

  try {
    const clientIp = getClientIp(request);
    const limit = await consumeRateLimit({
      key: `analytics:${clientIp}`,
      limit: 120,
      windowMs: 60 * 1000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(getRetryAfterSeconds(limit.retryAfterMs)) } }
      );
    }

    const body = await request.json();
    const page = sanitizeText(body.page, 180);
    if (!page || !page.startsWith('/') || page.includes('://')) {
      return NextResponse.json({ error: 'page is required' }, { status: 400 });
    }

    const locale = sanitizeText(body.locale, 2);
    const safeLocale = locale === 'fr' || locale === 'en' ? locale : undefined;
    const referrer = sanitizeText(body.referrer, 300) || undefined;

    await recordPageView(
      sessionId,
      page,
      safeLocale,
      referrer
    );

    return NextResponse.json({ success: true });
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

    console.error('[api/analytics/pageview]', e);
    return NextResponse.json({ error: 'Failed to record pageview' }, { status: 500 });
  }
}
