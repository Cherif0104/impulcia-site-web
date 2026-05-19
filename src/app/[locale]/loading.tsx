export default function LocaleLoading() {
  return (
    <div className="pt-24 pb-20 bg-[var(--page-bg)] text-[var(--text-main)]">
      <section className="section-container">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm dark:border-brand-border dark:bg-brand-panel/40">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-brand-accent" />
            <span className="text-sm text-slate-600 dark:text-brand-muted">
              Chargement de la page...
            </span>
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-brand-panel/60" />
            <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-brand-panel/60" />
            <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-brand-panel/60" />
          </div>
        </div>
      </section>
    </div>
  );
}
