import { NextRequest, NextResponse } from 'next/server';
import {
  RateLimitProviderUnavailableError,
  consumeRateLimit,
  getClientIp,
  getRetryAfterSeconds,
  sanitizeText,
} from '@/src/lib/anti-abuse';
import { createRequestInteraction, createServiceRequest } from '@/src/lib/db';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = await consumeRateLimit({
      key: `public-requests:${ip}`,
      limit: 6,
      windowMs: 10 * 60 * 1000,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(getRetryAfterSeconds(limit.retryAfterMs)) } }
      );
    }

    const body = await request.json();
    const workspaceId = sanitizeText(body.workspaceId, 80);
    const organizationId = sanitizeText(body.organizationId, 80);
    const title = sanitizeText(body.title, 180);
    const description = sanitizeText(body.description, 4000);
    const createdByEmail = sanitizeText(body.createdByEmail, 160).toLowerCase();
    const honeypot = sanitizeText(body.companyWebsite, 120);

    if (honeypot) {
      return NextResponse.json({ success: true }, { status: 202 });
    }
    if (!workspaceId || !organizationId || !title || !description) {
      return NextResponse.json(
        { error: 'workspaceId, organizationId, title and description are required' },
        { status: 400 }
      );
    }
    if (!createdByEmail || !EMAIL_RE.test(createdByEmail)) {
      return NextResponse.json({ error: 'A valid createdByEmail is required' }, { status: 400 });
    }

    const priority =
      body.priority === 'low' || body.priority === 'high' || body.priority === 'critical'
        ? body.priority
        : 'medium';

    const serviceRequest = await createServiceRequest({
      workspaceId,
      organizationId,
      title,
      description,
      priority,
      createdByEmail,
    });

    await createRequestInteraction({
      requestId: serviceRequest.id,
      authorType: 'client',
      body: description,
    });

    return NextResponse.json({ success: true, requestId: serviceRequest.id }, { status: 201 });
  } catch (error) {
    if (error instanceof RateLimitProviderUnavailableError) {
      return NextResponse.json(
        {
          error:
            'Anti-abuse provider unavailable in production. Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.',
        },
        { status: error.statusCode }
      );
    }
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}
