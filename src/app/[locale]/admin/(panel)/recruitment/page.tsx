import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createJobOffer, deleteJobOffer, listJobOffers, updateJobOffer } from '@/src/lib/db';
import { hasRequiredAdminRole } from '@/src/lib/admin-auth';

const EMPLOYMENT_TYPES = ['full_time', 'part_time', 'contract', 'internship'] as const;

export default async function AdminRecruitmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(await hasRequiredAdminRole(['workspace_manager', 'org_admin', 'owner']))) {
    redirect(`/${locale}/admin`);
  }
  const isFr = locale === 'fr';
  const offers = await listJobOffers();

  async function createOfferAction(formData: FormData) {
    'use server';
    const title = String(formData.get('title') || '').trim();
    const slug = String(formData.get('slug') || '').trim().toLowerCase();
    const location = String(formData.get('location') || '').trim();
    const team = String(formData.get('team') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const employmentTypeRaw = String(formData.get('employmentType') || 'full_time');
    const employmentType = EMPLOYMENT_TYPES.includes(employmentTypeRaw as (typeof EMPLOYMENT_TYPES)[number])
      ? (employmentTypeRaw as (typeof EMPLOYMENT_TYPES)[number])
      : 'full_time';
    const published = String(formData.get('published') || '') === 'on';
    if (!title || !slug || !description) return;
    await createJobOffer({
      title,
      slug,
      location: location || undefined,
      team: team || undefined,
      description,
      employmentType,
      published,
    });
    revalidatePath(`/${locale}/admin/recruitment`);
  }

  async function togglePublishAction(formData: FormData) {
    'use server';
    const id = String(formData.get('id') || '').trim();
    const published = String(formData.get('published') || '') === 'true';
    if (!id) return;
    await updateJobOffer(id, { published });
    revalidatePath(`/${locale}/admin/recruitment`);
  }

  async function deleteOfferAction(formData: FormData) {
    'use server';
    const id = String(formData.get('id') || '').trim();
    if (!id) return;
    await deleteJobOffer(id);
    revalidatePath(`/${locale}/admin/recruitment`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">{isFr ? 'Recrutement' : 'Recruitment'}</h1>
        <p className="text-sm text-brand-muted mt-2">
          {isFr
            ? 'Creation et publication des offres visibles sur le site public.'
            : 'Create and publish offers visible on the public website.'}
        </p>
      </div>

      <form action={createOfferAction} className="glass-panel rounded-xl border border-brand-border/50 p-5 space-y-3">
        <h2 className="text-white font-semibold">{isFr ? 'Nouvelle offre' : 'New job offer'}</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input name="title" required placeholder={isFr ? 'Titre du poste' : 'Job title'} className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
          <input name="slug" required placeholder="slug" className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
          <input name="location" placeholder={isFr ? 'Localisation' : 'Location'} className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
          <input name="team" placeholder={isFr ? 'Equipe' : 'Team'} className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
          <select name="employmentType" className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white">
            {EMPLOYMENT_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-brand-muted">
            <input type="checkbox" name="published" /> {isFr ? 'Publier immediatement' : 'Publish immediately'}
          </label>
        </div>
        <textarea name="description" required rows={6} placeholder={isFr ? 'Description du poste' : 'Job description'} className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
        <button type="submit" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy">
          {isFr ? 'Creer l offre' : 'Create offer'}
        </button>
      </form>

      <div className="space-y-4">
        {offers.map((offer) => (
          <article key={offer.id} className="glass-panel rounded-xl border border-brand-border/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-white font-semibold">{offer.title}</h3>
                <p className="text-xs text-brand-muted mt-1">
                  {offer.team ?? '—'} · {offer.location ?? '—'} · {offer.employment_type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <form action={togglePublishAction}>
                  <input type="hidden" name="id" value={offer.id} />
                  <input type="hidden" name="published" value={String(!offer.published)} />
                  <button type="submit" className="rounded-lg border border-brand-accent/40 px-3 py-2 text-xs text-brand-accent">
                    {offer.published ? (isFr ? 'Depublier' : 'Unpublish') : isFr ? 'Publier' : 'Publish'}
                  </button>
                </form>
                <form action={deleteOfferAction}>
                  <input type="hidden" name="id" value={offer.id} />
                  <button type="submit" className="rounded-lg border border-red-500/40 px-3 py-2 text-xs text-red-300">
                    {isFr ? 'Supprimer' : 'Delete'}
                  </button>
                </form>
              </div>
            </div>
            <p className="text-sm text-slate-300 mt-3 whitespace-pre-wrap">{offer.description}</p>
          </article>
        ))}
      </div>
      {offers.length === 0 ? (
        <p className="text-sm text-brand-muted">{isFr ? 'Aucune offre pour le moment.' : 'No offers yet.'}</p>
      ) : null}
    </div>
  );
}
