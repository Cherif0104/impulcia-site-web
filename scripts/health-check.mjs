#!/usr/bin/env node

const endpoint =
  process.argv[2] ??
  process.env.HEALTHCHECK_URL ??
  'http://127.0.0.1:4174/api/admin/health';

async function run() {
  let response;
  try {
    response = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
  } catch (error) {
    console.error(`[health-check] request_failed endpoint=${endpoint}`);
    console.error(String(error));
    process.exit(1);
    return;
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const okFlag = payload?.ok === true;
  const healthy = response.status < 400 && okFlag;

  if (!healthy) {
    console.error(
      `[health-check] unhealthy endpoint=${endpoint} status=${response.status} ok=${String(payload?.ok)}`
    );
    if (payload) {
      console.error(`[health-check] payload=${JSON.stringify(payload)}`);
    }
    process.exit(1);
    return;
  }

  const checkedAt = typeof payload?.checkedAt === 'string' ? payload.checkedAt : 'n/a';
  const provider = typeof payload?.antiAbuse?.provider === 'string' ? payload.antiAbuse.provider : 'unknown';
  const persistence =
    typeof payload?.persistence?.provider === 'string' ? payload.persistence.provider : 'unknown';
  console.log(
    `[health-check] healthy endpoint=${endpoint} status=${response.status} antiAbuse=${provider} persistence=${persistence} checkedAt=${checkedAt}`
  );
}

run();
