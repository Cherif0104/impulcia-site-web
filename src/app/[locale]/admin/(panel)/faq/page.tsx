import FaqAdminClient from '@/src/components/crm/FaqAdminClient';
import { listFaq } from '@/src/lib/db';
import { getTranslations } from 'next-intl/server';

export default async function AdminFaqPage() {
  const t = await getTranslations('crm.admin.faq');
  try {
    const items = await listFaq();

    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-white mb-6">{t('title')}</h1>
        <FaqAdminClient initialItems={items} />
      </div>
    );
  } catch {
    return (
      <div className="glass-panel rounded-xl p-6 border border-red-500/30">
        <h1 className="font-display text-2xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-sm text-red-300">Erreur de chargement de la FAQ.</p>
      </div>
    );
  }
}
