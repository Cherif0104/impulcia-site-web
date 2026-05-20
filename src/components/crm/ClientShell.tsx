import Link from 'next/link';

type ClientShellProps = {
  locale: string;
  email: string;
  logoutAction: React.ReactNode;
  children: React.ReactNode;
};

export default function ClientShell({ locale, email, logoutAction, children }: ClientShellProps) {
  const isFr = locale === 'fr';
  const base = `/${locale}`;

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col">
      <header className="border-b border-brand-border/60 bg-brand-slate">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="font-display text-sm font-bold text-white">
              {isFr ? 'Portail client IMPULCIA' : 'IMPULCIA client portal'}
            </p>
            <p className="text-xs text-brand-muted mt-0.5">{email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={base}
              className="text-xs text-brand-muted hover:text-brand-accent transition hidden sm:inline"
            >
              {isFr ? 'Site public' : 'Public site'}
            </Link>
            {logoutAction}
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}
