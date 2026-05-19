import { getRequestConfig } from 'next-intl/server';
import { routing } from './lib/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Load all translation files
  const [common, sections, landing, homepage, founderStory] = await Promise.all([
    import(`../public/locales/${locale}/common.json`),
    import(`../public/locales/${locale}/sections.json`),
    import(`../public/locales/${locale}/landing.json`),
    import(`../public/locales/${locale}/homepage.json`),
    import(`../public/locales/${locale}/founder-story.json`)
  ]);

  return {
    locale,
    messages: {
      ...common.default,
      ...sections.default,
      ...landing.default,
      ...homepage.default,
      ...founderStory.default
    }
  };
});

