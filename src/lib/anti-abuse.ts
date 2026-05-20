import { NextRequest } from 'next/server';

type Bucket = {
  count: number;
  windowStart: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

export type AbusePressureLevel = 'low' | 'medium' | 'high';

export type ProgressiveChallenge = {
  id: string;
  question: string;
};

const GLOBAL_KEY = '__impulcia_rate_limiter__';
const WINDOW_SEP = ':';

type RateLimitProvider = {
  consume(options: RateLimitOptions): Promise<RateLimitResult>;
};

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();

function isPlaceholderUpstashUrl(url: string | undefined): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes('your-upstash-endpoint') || lower.includes('example.upstash.io');
}

const upstashUrlEffective = isPlaceholderUpstashUrl(upstashUrl) ? undefined : upstashUrl;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
const hasUpstashConfig = Boolean(upstashUrlEffective && upstashToken);
const isProduction = process.env.NODE_ENV === 'production';

type AntiAbuseHealth = {
  provider: 'upstash' | 'memory';
  mode: 'strict' | 'fallback';
  upstashConfigured: boolean;
  fallbackAllowed: boolean;
};

export class RateLimitProviderUnavailableError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 503) {
    super(message);
    this.name = 'RateLimitProviderUnavailableError';
    this.statusCode = statusCode;
  }
}

let didWarnMemoryFallbackNoConfig = false;
let didWarnMemoryFallbackUpstashFailure = false;

function getStore(): Map<string, Bucket> {
  const scope = globalThis as typeof globalThis & {
    [GLOBAL_KEY]?: Map<string, Bucket>;
  };

  if (!scope[GLOBAL_KEY]) {
    scope[GLOBAL_KEY] = new Map<string, Bucket>();
  }

  return scope[GLOBAL_KEY]!;
}

function getWindowStart(now: number, windowMs: number): number {
  return now - (now % windowMs);
}

function getRetryAfterMs(windowStart: number, windowMs: number, now: number): number {
  return Math.max(0, windowStart + windowMs - now);
}

export function getRetryAfterSeconds(retryAfterMs: number): number {
  return Math.max(1, Math.ceil(retryAfterMs / 1000));
}

const memoryProvider: RateLimitProvider = {
  async consume(options) {
    const now = Date.now();
    const store = getStore();
    const windowStart = getWindowStart(now, options.windowMs);
    const key = `${options.key}${WINDOW_SEP}${windowStart}`;
    const existing = store.get(key);
    const count = (existing?.count ?? 0) + 1;

    store.set(key, { count, windowStart });

    const previousWindowStart = windowStart - options.windowMs;
    store.delete(`${options.key}${WINDOW_SEP}${previousWindowStart}`);

    if (count > options.limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: getRetryAfterMs(windowStart, options.windowMs, now),
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, options.limit - count),
      retryAfterMs: getRetryAfterMs(windowStart, options.windowMs, now),
    };
  },
};

function getUpstashEndpoint(): string {
  return `${upstashUrl}/pipeline`;
}

async function consumeUpstashRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = getWindowStart(now, options.windowMs);
  const redisKey = `${options.key}${WINDOW_SEP}${windowStart}`;
  const ttlSeconds = Math.max(1, Math.ceil(options.windowMs / 1000));

  const response = await fetch(getUpstashEndpoint(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${upstashToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['INCR', redisKey],
      ['EXPIRE', redisKey, String(ttlSeconds)],
    ]),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Upstash HTTP ${response.status}`);
  }

  type UpstashPipelineResult = Array<{ result?: number | string | null; error?: string }>;
  const payload = (await response.json()) as UpstashPipelineResult;
  const incrementResult = payload[0];
  const countValue = Number(incrementResult?.result ?? 0);

  if (!Number.isFinite(countValue) || countValue <= 0) {
    throw new Error('Invalid Upstash INCR response');
  }

  if (countValue > options.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: getRetryAfterMs(windowStart, options.windowMs, now),
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, options.limit - countValue),
    retryAfterMs: getRetryAfterMs(windowStart, options.windowMs, now),
  };
}

const rateLimitProvider: RateLimitProvider = {
  async consume(options) {
    if (!hasUpstashConfig) {
      if (isProduction) {
        const message =
          'Rate-limit provider unavailable: missing UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN in production';
        console.error('[anti-abuse] ' + message);
        throw new RateLimitProviderUnavailableError(message);
      }

      if (!didWarnMemoryFallbackNoConfig) {
        didWarnMemoryFallbackNoConfig = true;
        console.warn('[anti-abuse] Upstash not configured, using in-memory fallback (dev/local only).');
      }

      return memoryProvider.consume(options);
    }

    try {
      return await consumeUpstashRateLimit(options);
    } catch (error) {
      if (isProduction) {
        const message = 'Rate-limit provider unavailable: Upstash request failed in production';
        console.error('[anti-abuse] ' + message, error);
        throw new RateLimitProviderUnavailableError(message);
      }

      if (!didWarnMemoryFallbackUpstashFailure) {
        didWarnMemoryFallbackUpstashFailure = true;
        console.warn('[anti-abuse] Upstash unavailable, using in-memory fallback (dev/local only).', error);
      }

      return memoryProvider.consume(options);
    }
  },
};

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  return 'unknown';
}

export async function consumeRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  return rateLimitProvider.consume(options);
}

export function getAntiAbuseHealth(): AntiAbuseHealth {
  if (hasUpstashConfig) {
    return {
      provider: 'upstash',
      mode: 'strict',
      upstashConfigured: true,
      fallbackAllowed: !isProduction,
    };
  }

  return {
    provider: 'memory',
    mode: isProduction ? 'strict' : 'fallback',
    upstashConfigured: false,
    fallbackAllowed: !isProduction,
  };
}

export function sanitizeText(value: unknown, maxLength: number): string {
  return String(value ?? '').trim().slice(0, maxLength);
}

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

function buildChallengeForBucket(seedBase: string, bucket: number): ProgressiveChallenge & { answer: number } {
  const seed = hashSeed(`${seedBase}:${bucket}`);
  const a = (seed % 8) + 2;
  const b = ((seed >>> 3) % 8) + 2;
  return {
    id: `${bucket}:${a}:${b}`,
    question: `Combien font ${a} + ${b} ?`,
    answer: a + b,
  };
}

export function getProgressiveChallenge(identity: string): ProgressiveChallenge {
  const bucket = Math.floor(Date.now() / (5 * 60 * 1000));
  const challenge = buildChallengeForBucket(identity, bucket);
  return { id: challenge.id, question: challenge.question };
}

export function validateProgressiveChallenge(input: {
  identity: string;
  challengeId?: string;
  challengeAnswer?: string;
}): boolean {
  const answer = Number(String(input.challengeAnswer ?? '').trim());
  if (!Number.isFinite(answer)) return false;

  const nowBucket = Math.floor(Date.now() / (5 * 60 * 1000));
  const candidates = [
    buildChallengeForBucket(input.identity, nowBucket),
    buildChallengeForBucket(input.identity, nowBucket - 1),
  ];

  return candidates.some((challenge) => {
    if (input.challengeId && input.challengeId !== challenge.id) return false;
    return challenge.answer === answer;
  });
}

export async function getAbusePressure(input: {
  route: string;
  ip: string;
  sessionId: string;
}): Promise<AbusePressureLevel> {
  const key = `${input.route}:${input.ip}:${input.sessionId || 'na'}`;
  const burst = await consumeRateLimit({
    key: `${key}:burst`,
    limit: 4,
    windowMs: 5 * 60 * 1000,
  });

  if (!burst.allowed || burst.remaining <= 0) return 'high';
  if (burst.remaining <= 1) return 'medium';
  return 'low';
}
