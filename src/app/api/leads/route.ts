import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/src/lib/db';
import { getSessionIdFromRequest } from '@/src/lib/session';
import {
  consumeRateLimit,
  getAbusePressure,
  getClientIp,
  getProgressiveChallenge,
  getRetryAfterSeconds,
  RateLimitProviderUnavailableError,
  sanitizeText,
  validateProgressiveChallenge,
} from '@/src/lib/anti-abuse';
import { sendLeadConfirmationEmail } from '@/src/lib/notifications/email';
import {
  buildLeadWebhookPayload,
  sendOutgoingWebhook,
} from '@/src/lib/notifications/outgoing-webhook';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[\p{L}\p{N}\s'.-]{2,80}$/u;
const LOCALE_RE = /^(fr|en)$/;

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const sessionId = getSessionIdFromRequest(request.headers.get('x-session-id')) ?? 'anonymous';
    const limit = await consumeRateLimit({
      key: `leads:${clientIp}:${sessionId}`,
      limit: 8,
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

    const honeypot = sanitizeText(body.website ?? body.companyWebsite, 160);
    if (honeypot) {
      return NextResponse.json({ success: true }, { status: 202 });
    }

    const firstName = sanitizeText(body.firstName, 80);
    const lastName = sanitizeText(body.lastName, 80);
    const email = sanitizeText(body.email, 190).toLowerCase();
    const consent = body.consent === true;

    if (!NAME_RE.test(firstName) || !NAME_RE.test(lastName)) {
      return NextResponse.json({ error: 'firstName and lastName are required' }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ error: 'Consent is required' }, { status: 400 });
    }

    const locale = sanitizeText(body.locale, 2);
    const safeLocale = LOCALE_RE.test(locale) ? locale : 'fr';
    const pressure = await getAbusePressure({
      route: 'leads',
      ip: clientIp,
      sessionId,
    });
    const submissionStartedAt = Number(body.submissionStartedAt ?? 0);
    if ((pressure === 'medium' || pressure === 'high') && Number.isFinite(submissionStartedAt)) {
      const elapsedMs = Date.now() - submissionStartedAt;
      if (elapsedMs < 2500) {
        const challenge = getProgressiveChallenge(`${clientIp}:${sessionId}`);
        return NextResponse.json(
          {
            error: 'Verification required',
            challenge,
            level: pressure,
          },
          { status: 428 }
        );
      }
    }
    if (pressure === 'high') {
      const challengeValid = validateProgressiveChallenge({
        identity: `${clientIp}:${sessionId}`,
        challengeId: sanitizeText(body.challengeId, 100),
        challengeAnswer: sanitizeText(body.challengeAnswer, 20),
      });
      if (!challengeValid) {
        return NextResponse.json(
          {
            error: 'Challenge answer required',
            challenge: getProgressiveChallenge(`${clientIp}:${sessionId}`),
            level: pressure,
          },
          { status: 428 }
        );
      }
    }

    const wantsChecklist = body.wantsChecklist === true;
    const userMessage = sanitizeText(body.message, 2000) || undefined;
    const enrichedMessage = wantsChecklist
      ? `${userMessage ? `${userMessage}\n\n` : ''}[lead-magnet] checklist-transformation-si-afrique`
      : userMessage;

    const lead = await createLead({
      firstName,
      lastName,
      email,
      phone: sanitizeText(body.phone, 40) || undefined,
      address: sanitizeText(body.address, 160) || undefined,
      activity: sanitizeText(body.activity, 120) || undefined,
      domain: sanitizeText(body.domain, 120) || undefined,
      message: enrichedMessage,
      source: sanitizeText(body.source, 60) || 'website',
      locale: safeLocale,
      scoring: {
        budget: sanitizeText(body.budget, 120),
        timeline: sanitizeText(body.timeline, 120),
        maturity: sanitizeText(body.projectStage, 120),
        source: sanitizeText(body.source, 60) || 'website',
        requestType: sanitizeText(body.objective, 160),
        partnerModel: Array.isArray(body.partnerModel)
          ? body.partnerModel.map((item: unknown) => sanitizeText(item, 120)).filter(Boolean)
          : [],
        activity: sanitizeText(body.activity, 120),
      },
    });

    void sendLeadConfirmationEmail({
      to: email,
      firstName,
      locale: safeLocale as 'fr' | 'en',
      leadId: lead.id,
    });
    void sendOutgoingWebhook(
      buildLeadWebhookPayload({
        leadId: lead.id,
        source: sanitizeText(body.source, 60) || 'website',
        email,
        locale: safeLocale,
        score: lead.score ?? 0,
        priority: lead.priority ?? 'medium',
        potential: lead.potential ?? 'medium',
        urgency: lead.urgency ?? 'medium',
      })
    );

    return NextResponse.json(
      {
        success: true,
        id: lead.id,
        scoring: {
          score: lead.score,
          priority: lead.priority,
          potential: lead.potential,
          urgency: lead.urgency,
        },
      },
      { status: 201 }
    );
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

    console.error('[api/leads]', e);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
