import { NextRequest, NextResponse } from 'next/server';
import { getSessionIdFromRequest } from '@/src/lib/session';
import {
  consumeRateLimit,
  getClientIp,
  getRetryAfterSeconds,
  RateLimitProviderUnavailableError,
  sanitizeText,
} from '@/src/lib/anti-abuse';
import { recordConversionEvent } from '@/src/lib/db';

const CATEGORY_RE = /^(cta|form|funnel)$/;

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
      key: `analytics_event:${clientIp}`,
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
    const name = sanitizeText(body.name, 120);
    const category = sanitizeText(body.category, 16);
    const page = sanitizeText(body.page, 180);
    const value = sanitizeText(body.value, 160) || undefined;
    const metadata =
      body.metadata && typeof body.metadata === 'object'
        ? JSON.stringify(body.metadata).slice(0, 2000)
        : null;

    if (!name || !category || !CATEGORY_RE.test(category)) {
      return NextResponse.json({ error: 'Invalid event payload' }, { status: 400 });
    }

    await recordConversionEvent({
      sessionId,
      name,
      category: category as 'cta' | 'form' | 'funnel',
      page: page || '/',
      value,
      metadata,
    });

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
    console.error('[api/analytics/event]', e);
    return NextResponse.json({ error: 'Failed to record analytics event' }, { status: 500 });
  }
}
