import { NextRequest, NextResponse } from 'next/server';
import { createMessage, listEngagements, recordConversionEvent } from '@/src/lib/db';
import { isAdminAuthenticated } from '@/src/lib/admin-auth';
import { getSessionIdFromRequest } from '@/src/lib/session';
import {
  consumeRateLimit,
  getClientIp,
  getRetryAfterSeconds,
  RateLimitProviderUnavailableError,
  sanitizeText,
} from '@/src/lib/anti-abuse';
import {
  buildEngagementWebhookPayload,
  sendOutgoingWebhook,
} from '@/src/lib/notifications/outgoing-webhook';

const ACTION_RE =
  /^(architect_whatsapp_click|partner_diagnostic_submitted|contact_submitted|contact_expert_clicked|diagnostic_clicked)$/;
const PAGE_RE = /^\/[a-zA-Z0-9\-\/\[\]]{1,180}$/;
const LOCALE_RE = /^(fr|en)$/;

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const source = sanitizeText(request.nextUrl.searchParams.get('source'), 80);
  const action = sanitizeText(request.nextUrl.searchParams.get('action'), 80);
  const startDate = sanitizeText(request.nextUrl.searchParams.get('startDate'), 32);
  const endDate = sanitizeText(request.nextUrl.searchParams.get('endDate'), 32);
  const engagements = await listEngagements({
    source: source || undefined,
    action: action || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });
  return NextResponse.json({ engagements });
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const limit = await consumeRateLimit({
      key: `engagement:${clientIp}`,
      limit: 50,
      windowMs: 10 * 60 * 1000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(getRetryAfterSeconds(limit.retryAfterMs)) } }
      );
    }

    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const sessionId = getSessionIdFromRequest(request.headers.get('x-session-id'));
    const action = sanitizeText(body.action, 60);
    const page = sanitizeText(body.page, 180);
    const locale = sanitizeText(body.locale, 2);
    const source = sanitizeText(body.source, 80) || 'website';
    const details = sanitizeText(body.details, 1200);

    if (!ACTION_RE.test(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    if (page && !PAGE_RE.test(page)) {
      return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
    }
    if (locale && !LOCALE_RE.test(locale)) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }

    const normalizedPage = page || '/';
    const normalizedLocale = LOCALE_RE.test(locale) ? locale : 'fr';
    const messageBody = [
      `[engagement] ${action}`,
      `source: ${source}`,
      `page: ${normalizedPage}`,
      `locale: ${normalizedLocale}`,
      details ? `details: ${details}` : '',
      sessionId ? `session: ${sessionId}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    await createMessage({
      leadId: null,
      channel: 'web',
      direction: 'inbound',
      body: messageBody,
    });

    if (sessionId) {
      await recordConversionEvent({
        sessionId,
        name: action,
        category: action === 'architect_whatsapp_click' ? 'cta' : 'form',
        page: normalizedPage,
        value: source,
        metadata: JSON.stringify({ locale: normalizedLocale, source }).slice(0, 2000),
      });
    }

    void sendOutgoingWebhook(
      buildEngagementWebhookPayload({
        action,
        source,
        page: normalizedPage,
        locale: normalizedLocale,
        sessionId,
      })
    );

    return NextResponse.json({ success: true }, { status: 201 });
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

    console.error('[api/engagement]', e);
    return NextResponse.json({ error: 'Failed to record engagement' }, { status: 500 });
  }
}
