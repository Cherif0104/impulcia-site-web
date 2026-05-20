import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import JsonLd from '@/src/components/seo/JsonLd';
import { createSiteDefaultsMetadata } from '@/src/lib/seo/metadata';
import { routing } from '@/src/lib/routing';
import AppChrome from '@/src/components/AppChrome';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createSiteDefaultsMetadata(locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'fr' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`dark ${inter.variable} ${plusJakarta.variable}`}
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="font-sans">
        <JsonLd locale={locale as 'fr' | 'en'} />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(()=>{try{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('dark');localStorage.setItem('impulcia-theme','dark');}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.classList.add('dark');}})();",
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <AppChrome>{children}</AppChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
