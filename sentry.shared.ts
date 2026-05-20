import type { ErrorEvent, EventHint } from '@sentry/nextjs';

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const TOKEN_KEYS = ['authorization', 'cookie', 'password', 'token', 'secret'];

function scrubString(value: string): string {
  return value.replace(EMAIL_RE, '[email-redacted]');
}

function scrubObject(value: unknown): unknown {
  if (typeof value === 'string') return scrubString(value);
  if (Array.isArray(value)) return value.map(scrubObject);
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(record)) {
      if (TOKEN_KEYS.some((k) => key.toLowerCase().includes(k))) {
        out[key] = '[redacted]';
      } else {
        out[key] = scrubObject(entry);
      }
    }
    return out;
  }
  return value;
}

export function sentryBeforeSend(event: ErrorEvent, _hint: EventHint): ErrorEvent | null {
  if (event.message) event.message = scrubString(event.message);
  if (event.request?.headers) {
    event.request.headers = scrubObject(event.request.headers) as Record<string, string>;
  }
  if (event.extra) event.extra = scrubObject(event.extra) as Record<string, unknown>;
  return event;
}

export const sentryBaseOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN),
  beforeSend: sentryBeforeSend,
};
