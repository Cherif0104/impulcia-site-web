import { NextResponse } from 'next/server';
import { getAntiAbuseHealth } from '@/src/lib/anti-abuse';
import { getEnvHealth } from '@/src/lib/env';
import { getPersistenceHealth } from '@/src/lib/supabase/server';

export async function GET() {
  const isProduction = process.env.NODE_ENV === 'production';
  const antiAbuse = getAntiAbuseHealth();
  const envHealth = getEnvHealth();
  const persistence = getPersistenceHealth();

  const antiAbuseOk = isProduction ? antiAbuse.upstashConfigured : true;
  const persistenceOk = isProduction ? persistence.productionReady : true;
  const envOk = isProduction ? envHealth.ok : true;

  const ok = antiAbuseOk && persistenceOk && envOk;
  const status = ok ? 'ok' : 'degraded';
  const statusCode = ok ? 200 : 503;

  return NextResponse.json(
    {
      ok,
      status,
      code: statusCode,
      env: process.env.NODE_ENV ?? 'development',
      service: 'api-admin-health',
      antiAbuse,
      persistence: {
        provider: persistence.provider,
        productionReady: persistence.productionReady,
      },
      envHealth: {
        ok: envHealth.ok,
        checks: envHealth.checks.map((c) => ({
          key: c.key,
          ok: c.ok,
          message: c.message,
        })),
      },
      checks: {
        antiAbuseProvider: antiAbuse.provider,
        antiAbuseStrictInProd: isProduction ? antiAbuse.upstashConfigured : true,
        persistenceProvider: persistence.provider,
        persistenceReadyInProd: isProduction ? persistence.productionReady : true,
        envRequiredInProd: isProduction ? envHealth.ok : true,
      },
      checkedAt: new Date().toISOString(),
    },
    { status: statusCode }
  );
}
