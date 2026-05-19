import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
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
    <html lang={locale} className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(()=>{try{var t=localStorage.getItem('impulcia-theme');var m=(t==='light'||t==='dark')?t:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=m;document.documentElement.classList.toggle('dark',m==='dark');}catch(e){var s=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';document.documentElement.dataset.theme=s;document.documentElement.classList.toggle('dark',s==='dark');}})();",
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <AppChrome>{children}</AppChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
