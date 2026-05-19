'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { FaqItem } from '@/src/types/crm';

export default function FaqAdminClient({ initialItems }: { initialItems: FaqItem[] }) {
  const t = useTranslations('crm.admin.faq');
  const [items, setItems] = useState(initialItems);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    locale: 'fr',
    question: '',
    answer: '',
    order: 0,
    published: true,
  });

  async function refresh() {
    const res = await fetch('/api/admin/faq');
    if (!res.ok) throw new Error('refresh failed');
    const data = await res.json();
    setItems(data.items ?? []);
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback('');
    try {
      const res = await fetch('/api/admin/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('save failed');
      setForm({ locale: 'fr', question: '', answer: '', order: 0, published: true });
      await refresh();
      setFeedback('FAQ enregistrée avec succès.');
    } catch {
      setFeedback('Erreur lors de l’enregistrement.');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    setFeedback('');
    try {
      const res = await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete failed');
      await refresh();
      setFeedback('Élément FAQ supprimé.');
    } catch {
      setFeedback('Erreur lors de la suppression.');
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={addItem} className="glass-panel rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">{t('add')}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            placeholder={t('locale')}
            value={form.locale}
            onChange={(e) => setForm({ ...form, locale: e.target.value })}
            className="rounded-lg border border-brand-border/60 bg-brand-panel/50 px-3 py-2 text-sm text-white"
          />
          <input
            type="number"
            placeholder={t('order')}
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="rounded-lg border border-brand-border/60 bg-brand-panel/50 px-3 py-2 text-sm text-white"
          />
        </div>
        <input
          placeholder={t('question')}
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          required
          className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/50 px-3 py-2 text-sm text-white"
        />
        <textarea
          placeholder={t('answer')}
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          required
          rows={3}
          className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/50 px-3 py-2 text-sm text-white"
        />
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          {t('published')}
        </label>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-brand-accent text-brand-navy text-sm font-semibold"
        >
          {loading ? '...' : t('save')}
        </button>
        {feedback && <p className="text-xs text-brand-muted">{feedback}</p>}
      </form>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="glass-panel rounded-xl p-4 flex justify-between gap-4">
            <div>
              <p className="text-xs text-brand-accent mb-1">
                {item.locale} · #{item.order} {item.published ? '' : '(draft)'}
              </p>
              <p className="font-medium text-white">{item.question}</p>
              <p className="text-sm text-brand-muted mt-1 line-clamp-2">{item.answer}</p>
            </div>
            <button
              type="button"
              onClick={() => void remove(item.id)}
              className="text-xs text-red-400 hover:text-red-300 shrink-0 h-fit"
            >
              {t('delete')}
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-brand-muted">Aucune entrée FAQ pour le moment.</li>
        )}
      </ul>
    </div>
  );
}
