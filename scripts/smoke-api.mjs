#!/usr/bin/env node

const baseUrl = (process.argv[2] ?? process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:4174').replace(/\/$/, '');

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    cache: 'no-store',
  });
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { url, response, body };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function run() {
  console.log(`[smoke-api] base=${baseUrl}`);

  const health = await request('/api/admin/health');
  assert(health.response.status === 200, `health status ${health.response.status}`);
  assert(health.body?.ok === true, 'health ok flag false');
  console.log('[smoke-api] GET /api/admin/health OK');

  const adminBad = await request('/api/admin/auth', {
    method: 'POST',
    body: JSON.stringify({ password: 'wrong-password-smoke-test' }),
  });
  assert(adminBad.response.status === 401, `admin auth expected 401 got ${adminBad.response.status}`);
  console.log('[smoke-api] POST /api/admin/auth invalid password OK');

  const clientBad = await request('/api/client/auth', {
    method: 'POST',
    body: JSON.stringify({ email: '', password: '' }),
  });
  assert(
    clientBad.response.status === 400 || clientBad.response.status === 401,
    `client auth expected 400/401 got ${clientBad.response.status}`
  );
  console.log('[smoke-api] POST /api/client/auth missing credentials OK');

  const leadsNoBody = await request('/api/leads', {
    method: 'POST',
    body: JSON.stringify({}),
  });
  assert(
    leadsNoBody.response.status === 400 ||
      leadsNoBody.response.status === 429 ||
      leadsNoBody.response.status === 503,
    `leads expected 400/429/503 got ${leadsNoBody.response.status}`
  );
  console.log('[smoke-api] POST /api/leads validation OK');

  console.log('[smoke-api] all checks passed');
}

run().catch((error) => {
  console.error('[smoke-api] failed:', error.message);
  process.exit(1);
});
