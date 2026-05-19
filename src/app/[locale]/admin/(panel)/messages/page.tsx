import { getTranslations } from 'next-intl/server';
import { listMessages } from '@/src/lib/db';

export default async function AdminMessagesPage() {
  const t = await getTranslations('crm.admin.messages');
  try {
    const messages = await listMessages();

    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-white mb-6">{t('title')}</h1>
        <div className="space-y-3">
          {messages.map((m) => (
            <article key={m.id} className="glass-panel rounded-xl p-4 border-brand-border/40">
              <div className="flex flex-wrap gap-2 text-xs text-brand-muted mb-2">
                <span className="text-brand-accent">{m.channel}</span>
                <span>·</span>
                <span>{m.direction}</span>
                <span>·</span>
                <span>{new Date(m.created_at).toLocaleString()}</span>
                {m.lead_id && <span>· lead {m.lead_id.slice(0, 8)}</span>}
              </div>
              <p className="text-sm text-slate-200 whitespace-pre-wrap">{m.body}</p>
            </article>
          ))}
          {messages.length === 0 && (
            <p className="text-brand-muted text-sm">Aucun message reçu pour le moment.</p>
          )}
        </div>
      </div>
    );
  } catch {
    return (
      <div className="glass-panel rounded-xl p-6 border border-red-500/30">
        <h1 className="font-display text-2xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-sm text-red-300">Erreur de chargement des messages.</p>
      </div>
    );
  }
}
