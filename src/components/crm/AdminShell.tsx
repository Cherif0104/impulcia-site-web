'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

const navItems = [
  { href: '/admin', key: 'dashboard', exact: true },
  { href: '/admin/management', key: 'management' },
  { href: '/admin/organizations', key: 'organizations' },
  { href: '/admin/workspaces', key: 'workspaces' },
  { href: '/admin/requests', key: 'requests' },
  { href: '/admin/team', key: 'team' },
  { href: '/admin/recruitment', key: 'recruitment' },
  { href: '/admin/leads', key: 'leads' },
  { href: '/admin/engagements', key: 'engagements' },
  { href: '/admin/messages', key: 'messages' },
  { href: '/admin/faq', key: 'faq' },
  { href: '/admin/analytics', key: 'analytics' },
] as const;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('crm.admin');
  const locale = useLocale();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState({
    newLeads: 0,
    inboundMessages: 0,
  });

  const base = `/${locale}`;

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      try {
        const res = await fetch('/api/admin/notifications', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { newLeads?: number; inboundMessages?: number };
        if (!active) return;
        setNotifications({
          newLeads: data.newLeads ?? 0,
          inboundMessages: data.inboundMessages ?? 0,
        });
      } catch {
        // Keep shell resilient even if notification endpoint is unavailable.
      }
    }

    void loadSummary();
    const timer = window.setInterval(() => {
      void loadSummary();
    }, 30000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  async function signOut() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    window.location.href = `${base}/admin/login`;
  }

  return (
    <div className="min-h-screen bg-brand-navy flex">
      <aside className="w-64 shrink-0 border-r border-brand-border/60 bg-brand-slate hidden md:flex flex-col">
        <div className="p-6 border-b border-brand-border/40">
          <p className="font-display font-bold text-white">{t('title')}</p>
          <p className="text-xs text-brand-accent mt-1">IMPULCIA AFRIQUE</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const href = `${base}${item.href}`;
            const active =
              'exact' in item && item.exact
                ? pathname === href || pathname === `${href}/`
                : pathname.startsWith(href);
            return (
              <Link
                key={item.key}
                href={href}
                className={`block px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? 'bg-brand-accent/15 text-brand-accent font-medium'
                    : 'text-brand-muted hover:text-white hover:bg-brand-panel/50'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <span>{t(`nav.${item.key}`)}</span>
                  {item.key === 'leads' && notifications.newLeads > 0 ? (
                    <span className="rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-semibold text-brand-navy">
                      {notifications.newLeads}
                    </span>
                  ) : null}
                  {item.key === 'messages' && notifications.inboundMessages > 0 ? (
                    <span className="rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-semibold text-brand-navy">
                      {notifications.inboundMessages}
                    </span>
                  ) : null}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="px-4 pb-4">
          <a
            href="https://www.linkedin.com/company/impulcia-afrique/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-brand-border/60 px-3 py-2 text-xs text-brand-muted hover:text-brand-accent hover:border-brand-accent/50 transition"
          >
            {locale === 'fr' ? 'Ressource: LinkedIn IMPULCIA' : 'Resource: IMPULCIA LinkedIn'}
          </a>
        </div>
        <div className="p-4 border-t border-brand-border/40">
          <button
            type="button"
            onClick={() => void signOut()}
            className="w-full text-left text-sm text-brand-muted hover:text-white transition"
          >
            {t('signOut')}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="md:hidden border-b border-brand-border/60 bg-brand-slate p-4 flex justify-between items-center">
          <span className="font-display font-bold text-white text-sm">{t('title')}</span>
          <button type="button" onClick={() => void signOut()} className="text-xs text-brand-muted">
            {t('signOut')}
          </button>
        </header>
        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}
