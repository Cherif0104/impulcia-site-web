import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getLead, listMessages } from '@/src/lib/db';

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations('crm.admin.leads');
  const lead = await getLead(id);
  if (!lead) notFound();

  const messages = await listMessages(id);

  const fields = [
    { label: t('email'), value: lead.email },
    { label: t('score'), value: String(lead.score ?? 0) },
    { label: t('priority'), value: lead.priority || 'medium' },
    { label: t('potential'), value: lead.potential || 'medium' },
    { label: t('urgency'), value: lead.urgency || 'medium' },
    { label: t('phone'), value: lead.phone || '—' },
    { label: t('address'), value: lead.address || '—' },
    { label: t('activity'), value: lead.activity || '—' },
    { label: t('domain'), value: lead.domain || '—' },
    {
      label: t('whatsapp'),
      value: lead.whatsapp_clicked ? t('yes') : t('no'),
    },
    { label: t('message'), value: lead.message || '—' },
    { label: t('scoringDetails'), value: lead.scoring_details || '—' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-2">
        {lead.first_name} {lead.last_name}
      </h1>
      <p className="text-sm text-brand-muted mb-8">
        {new Date(lead.created_at).toLocaleString(locale)} · {lead.status}
      </p>
      <dl className="grid sm:grid-cols-2 gap-4 mb-10">
        {fields.map((f) => (
          <div key={f.label} className="glass-panel rounded-lg p-4">
            <dt className="text-xs text-brand-muted">{f.label}</dt>
            <dd className="text-sm text-white mt-1 break-words">{f.value}</dd>
          </div>
        ))}
      </dl>
      {messages.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Messages</h2>
          <ul className="space-y-2">
            {messages.map((m) => (
              <li key={m.id} className="text-sm text-slate-300 glass-panel rounded-lg p-3">
                <span className="text-brand-accent text-xs">{m.channel}</span> — {m.body}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
