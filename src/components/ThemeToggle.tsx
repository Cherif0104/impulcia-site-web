'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'impulcia-theme';

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.classList.toggle('dark', mode === 'dark');
}

function resolveInitialTheme(): ThemeMode {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = resolveInitialTheme();
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  if (!mounted) {
    return <div className="h-8 w-[68px] rounded-full border border-brand-border/30" aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-brand-border/60 bg-white px-2 py-1 text-xs font-semibold text-slate-700 transition hover:border-brand-accent dark:bg-brand-panel dark:text-slate-200"
      aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Enable light mode'}
      title={theme === 'light' ? 'Mode clair actif' : 'Dark mode active'}
    >
      <span className={theme === 'light' ? 'text-brand-accent' : 'text-slate-400'}>L</span>
      <span className={theme === 'dark' ? 'text-brand-accent' : 'text-slate-400'}>D</span>
    </button>
  );
}
