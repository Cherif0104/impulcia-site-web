const MIN_SECRET_LENGTH = 32;
const DEV_CLIENT_FALLBACK = 'impulcia-dev-client-secret';

export type EnvCheck = {
  key: string;
  ok: boolean;
  message?: string;
};

export type EnvHealth = {
  isProduction: boolean;
  ok: boolean;
  checks: EnvCheck[];
};

function trim(value: string | undefined): string {
  return value?.trim() ?? '';
}

function isProductionEnv(): boolean {
  return process.env.NODE_ENV === 'production';
}

function checkSecret(name: string, value: string, minLength = MIN_SECRET_LENGTH): EnvCheck {
  if (!value) {
    return { key: name, ok: false, message: 'missing' };
  }
  if (value.length < minLength) {
    return { key: name, ok: false, message: `too_short (min ${minLength})` };
  }
  return { key: name, ok: true };
}

export function getEnvHealth(): EnvHealth {
  const isProduction = isProductionEnv();
  const adminSecret = trim(process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD);
  const clientAuthSecret = trim(process.env.CLIENT_AUTH_SECRET);
  const supabaseUrl = trim(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = trim(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const upstashUrl = trim(process.env.UPSTASH_REDIS_REST_URL);
  const upstashToken = trim(process.env.UPSTASH_REDIS_REST_TOKEN);
  const enforceRoles =
    process.env.ADMIN_ENFORCE_ROLES === '1' || process.env.ADMIN_ENFORCE_ROLES === 'true';

  const checks: EnvCheck[] = [
    checkSecret('ADMIN_SECRET', adminSecret),
    checkSecret('CLIENT_AUTH_SECRET', clientAuthSecret),
    {
      key: 'CLIENT_AUTH_DISTINCT',
      ok: !clientAuthSecret || !adminSecret || clientAuthSecret !== adminSecret,
      message:
        clientAuthSecret && adminSecret && clientAuthSecret === adminSecret
          ? 'must differ from ADMIN_SECRET'
          : undefined,
    },
    {
      key: 'NEXT_PUBLIC_SUPABASE_URL',
      ok: Boolean(supabaseUrl),
      message: supabaseUrl ? undefined : 'missing',
    },
    {
      key: 'SUPABASE_SERVICE_ROLE_KEY',
      ok: Boolean(serviceRoleKey),
      message: serviceRoleKey ? undefined : 'missing',
    },
    {
      key: 'UPSTASH_REDIS_REST_URL',
      ok: Boolean(upstashUrl),
      message: upstashUrl ? undefined : 'missing',
    },
    {
      key: 'UPSTASH_REDIS_REST_TOKEN',
      ok: Boolean(upstashToken),
      message: upstashToken ? undefined : 'missing',
    },
  ];

  if (isProduction) {
    checks.push({
      key: 'ADMIN_ENFORCE_ROLES',
      ok: enforceRoles,
      message: enforceRoles ? undefined : 'should be true in production',
    });
  }

  const requiredInProd = isProduction
    ? checks
    : checks.filter((c) =>
        [
          'ADMIN_SECRET',
          'CLIENT_AUTH_SECRET',
          'NEXT_PUBLIC_SUPABASE_URL',
          'SUPABASE_SERVICE_ROLE_KEY',
          'UPSTASH_REDIS_REST_URL',
          'UPSTASH_REDIS_REST_TOKEN',
        ].includes(c.key)
      );

  const ok = requiredInProd.every((c) => c.ok);

  return { isProduction, ok: isProduction ? ok : true, checks };
}

export function assertProductionEnv(): void {
  if (!isProductionEnv()) return;

  const health = getEnvHealth();
  if (health.ok) return;

  const failed = health.checks.filter((c) => !c.ok).map((c) => `${c.key}: ${c.message ?? 'invalid'}`);
  throw new Error(`Production environment misconfigured: ${failed.join('; ')}`);
}

export function getClientAuthSecretForRuntime(): string {
  const explicit = trim(process.env.CLIENT_AUTH_SECRET);
  if (explicit) return explicit;

  if (isProductionEnv()) {
    throw new Error('CLIENT_AUTH_SECRET is required in production');
  }

  const adminFallback = trim(process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD);
  if (adminFallback) return adminFallback;

  return DEV_CLIENT_FALLBACK;
}

export { DEV_CLIENT_FALLBACK, MIN_SECRET_LENGTH };
