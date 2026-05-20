import { getRequestConfig } from 'next-intl/server';
import { routing } from '../lib/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const [common, enterprise, sections, landing, homepage, founderStory, legal, crm, seo] =
    await Promise.all([
      import(`../../public/locales/${locale}/common.json`),
      import(`../../public/locales/${locale}/enterprise.json`),
      import(`../../public/locales/${locale}/sections.json`),
      import(`../../public/locales/${locale}/landing.json`),
      import(`../../public/locales/${locale}/homepage.json`),
      import(`../../public/locales/${locale}/founder-story.json`),
      import(`../../public/locales/${locale}/legal.json`),
      import(`../../public/locales/${locale}/crm.json`),
      import(`../../public/locales/${locale}/seo.json`),
    ]);

  return {
    locale,
    messages: {
      common: common.default,
      enterprise: enterprise.default,
      sections: sections.default,
      landing: landing.default,
      homepage: homepage.default,
      founderStory: founderStory.default,
      legal: legal.default,
      crm: crm.default,
      seo: seo.default,
    },
  };
});
