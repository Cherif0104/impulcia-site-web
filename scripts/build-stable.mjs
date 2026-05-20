import { spawnSync } from 'node:child_process';

const NEXT_BIN = './node_modules/next/dist/bin/next';
const NATIVE_CRASH_CODES = new Set([-1073741819, -1073740791, 3221225477, 3221226505]);

function normalizeExitCode(code) {
  if (code === null || code === undefined) return null;
  if (code > 0x7fffffff) return code - 0x100000000;
  return code;
}

function buildNodeOptions(maxOldSpaceMb) {
  const options = (process.env.NODE_OPTIONS ?? '').trim();
  const memoryOption = `--max-old-space-size=${maxOldSpaceMb}`;
  if (!options) return memoryOption;
  if (options.includes('--max-old-space-size=')) return options;
  return `${options} ${memoryOption}`;
}

function runBuild(extraArgs = [], envOverrides = {}) {
  return spawnSync('node', [NEXT_BIN, 'build', ...extraArgs], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...envOverrides,
    },
    shell: false,
  });
}

const isWindows = process.platform === 'win32';
const attempts = isWindows
  ? [
      {
        args: ['--webpack'],
        label: 'webpack-memory-4096',
        env: { NODE_OPTIONS: buildNodeOptions(4096) },
      },
      {
        args: ['--webpack'],
        label: 'webpack-memory-6144',
        env: { NODE_OPTIONS: buildNodeOptions(6144) },
      },
      {
        args: ['--webpack'],
        label: 'webpack-memory-6144-retry',
        env: { NODE_OPTIONS: buildNodeOptions(6144) },
      },
    ]
  : [{ args: [], label: 'turbopack-default', env: {} }];

for (let i = 0; i < attempts.length; i += 1) {
  const attempt = attempts[i];
  const result = runBuild(attempt.args, attempt.env);
  const normalizedStatus = normalizeExitCode(result.status);
  const isNativeCrash =
    normalizedStatus !== null &&
    (NATIVE_CRASH_CODES.has(result.status) || NATIVE_CRASH_CODES.has(normalizedStatus));

  if (normalizedStatus === 0) {
    process.exit(0);
  }

  const canRetry = isWindows && i < attempts.length - 1;
  if (canRetry) {
    const nextAttempt = attempts[i + 1];
    const reason = isNativeCrash ? `native crash (${normalizedStatus})` : `exit code ${normalizedStatus}`;
    console.warn(`[build-stable] Build failed with ${reason} during ${attempt.label}; retrying with ${nextAttempt.label}.`);
    continue;
  }

  process.exit(normalizedStatus ?? 1);
}
