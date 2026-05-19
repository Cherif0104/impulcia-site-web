import { NextResponse } from 'next/server';
import { getAntiAbuseHealth } from '@/src/lib/anti-abuse';

export async function GET() {
  const antiAbuse = getAntiAbuseHealth();
  const isProdMisconfigured = process.env.NODE_ENV === 'production' && !antiAbuse.upstashConfigured;
  const status = isProdMisconfigured ? 'degraded' : 'ok';
  const statusCode = isProdMisconfigured ? 503 : 200;

  return NextResponse.json(
    {
      ok: status === 'ok',
      status,
      code: statusCode,
      env: process.env.NODE_ENV ?? 'development',
      service: 'api-admin-health',
      antiAbuse,
      checks: {
        antiAbuseProvider: antiAbuse.provider,
        antiAbuseStrictInProd: process.env.NODE_ENV !== 'production' ? true : antiAbuse.upstashConfigured,
      },
      checkedAt: new Date().toISOString(),
    },
    { status: statusCode }
  );
}
