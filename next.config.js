function loadSentryWrapper() {
  try {
    const { withSentryConfig } = require('@sentry/nextjs');
    return withSentryConfig;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[next.config] @sentry/nextjs not available; skipping Sentry wrapper.');
      return (config) => config;
    }
    throw err;
  }
}

const withSentryConfig = loadSentryWrapper();
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: [],
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

const config = withNextIntl(nextConfig);

// next-intl still sets experimental.turbo; Next.js 16 expects top-level turbopack
const turboAlias = config.experimental?.turbo?.resolveAlias;
if (turboAlias) {
  config.turbopack = {
    ...config.turbopack,
    resolveAlias: {
      ...config.turbopack?.resolveAlias,
      ...turboAlias,
    },
  };
  const { turbo, ...experimentalRest } = config.experimental;
  config.experimental =
    Object.keys(experimentalRest).length > 0 ? experimentalRest : undefined;
}

module.exports = withSentryConfig(config, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  telemetry: false,
});
