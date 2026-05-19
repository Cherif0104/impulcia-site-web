import { getSupabaseAdmin, isSupabaseConfigured } from '@/src/lib/supabase/server';
import { memoryStore, warnMemoryFallback } from '@/src/lib/db/memory-store';
import type { CookiePreferences, FaqItem, Lead, LeadInput, Message } from '@/src/types/crm';
import { computeLeadScore } from '@/src/lib/lead-scoring';

function shouldUseMemory() {
  if (!isSupabaseConfigured()) warnMemoryFallback();
  return !isSupabaseConfigured();
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const scoring = computeLeadScore({
    budget: input.scoring?.budget,
    timeline: input.scoring?.timeline,
    maturity: input.scoring?.maturity,
    source: input.scoring?.source ?? input.source,
    requestType: input.scoring?.requestType,
    partnerModel: input.scoring?.partnerModel,
    activity: input.scoring?.activity ?? input.activity,
  });
  const row = {
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    address: input.address?.trim() || null,
    activity: input.activity?.trim() || null,
    domain: input.domain?.trim() || null,
    message: input.message?.trim() || null,
    source: input.source || 'website',
    locale: input.locale || 'fr',
    score: scoring.score,
    priority: scoring.priority,
    potential: scoring.potential,
    urgency: scoring.urgency,
    scoring_details: scoring.summary,
  };

  if (shouldUseMemory()) {
    const lead = memoryStore.leads.create(row);
    if (row.message) {
      memoryStore.messages.create({
        lead_id: lead.id,
        channel: 'web',
        body: row.message,
        direction: 'inbound',
      });
    }
    return lead;
  }

  const supabase = getSupabaseAdmin()!;
  let data: Record<string, unknown> | null = null;
  const { data: inserted, error } = await supabase.from('leads').insert(row).select().single();
  if (error) {
    const scoreColumnsMissing =
      error.message.includes('score') ||
      error.message.includes('priority') ||
      error.message.includes('potential') ||
      error.message.includes('urgency') ||
      error.message.includes('scoring_details');
    if (!scoreColumnsMissing) throw new Error(error.message);

    // Backward-safe fallback for projects where migration not yet applied.
    const legacyRow = {
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      activity: row.activity,
      domain: row.domain,
      message: row.message,
      source: row.source,
      locale: row.locale,
    };
    const retry = await supabase.from('leads').insert(legacyRow).select().single();
    if (retry.error) throw new Error(retry.error.message);
    data = retry.data as Record<string, unknown>;
  } else {
    data = inserted as Record<string, unknown>;
  }

  if (row.message) {
    await supabase.from('messages').insert({
      lead_id: data.id,
      channel: 'web',
      body: row.message,
      direction: 'inbound',
    });
  }

  const lead = mapLead(data);
  return {
    ...lead,
    score: lead.score ?? scoring.score,
    priority: lead.priority ?? scoring.priority,
    potential: lead.potential ?? scoring.potential,
    urgency: lead.urgency ?? scoring.urgency,
    scoring_details: lead.scoring_details ?? scoring.summary,
  };
}

export async function listLeads(): Promise<Lead[]> {
  if (shouldUseMemory()) return memoryStore.leads.list();

  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapLead);
}

export async function getLead(id: string): Promise<Lead | null> {
  if (shouldUseMemory()) return memoryStore.leads.get(id);

  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase.from('leads').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapLead(data) : null;
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  const dbPatch: Record<string, unknown> = {};
  if (patch.status) dbPatch.status = patch.status;
  if (patch.whatsapp_clicked !== undefined) dbPatch.whatsapp_clicked = patch.whatsapp_clicked;

  if (shouldUseMemory()) return memoryStore.leads.update(id, patch);

  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase.from('leads').update(dbPatch).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data ? mapLead(data) : null;
}

export async function listMessages(leadId?: string): Promise<Message[]> {
  if (shouldUseMemory()) return memoryStore.messages.list(leadId);

  const supabase = getSupabaseAdmin()!;
  let q = supabase.from('messages').select('*').order('created_at', { ascending: false });
  if (leadId) q = q.eq('lead_id', leadId);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapMessage);
}

export async function createMessage(input: {
  leadId?: string | null;
  channel: Message['channel'];
  body: string;
  direction?: Message['direction'];
}): Promise<Message> {
  const payload = {
    lead_id: input.leadId ?? null,
    channel: input.channel,
    body: input.body.trim(),
    direction: input.direction ?? 'inbound',
  };

  if (shouldUseMemory()) {
    return memoryStore.messages.create(payload);
  }

  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase.from('messages').insert(payload).select('*').single();
  if (error) throw new Error(error.message);
  return mapMessage(data);
}

export type EngagementRecord = {
  id: string;
  created_at: string;
  action: string;
  source: string;
  page: string;
  locale: string;
  sessionId?: string;
  details?: string;
  channel: 'web' | 'whatsapp' | 'partner' | 'contact' | 'other';
};

function normalizeEngagementChannel(source: string, action: string): EngagementRecord['channel'] {
  const value = `${source} ${action}`.toLowerCase();
  if (value.includes('whatsapp')) return 'whatsapp';
  if (value.includes('partner')) return 'partner';
  if (value.includes('contact')) return 'contact';
  if (value.includes('web') || value.includes('website')) return 'web';
  return 'other';
}

function parseEngagementMessage(message: Message): EngagementRecord | null {
  if (!message.body.startsWith('[engagement]')) return null;
  const lines = message.body.split('\n').map((line) => line.trim());
  const action = lines[0].replace('[engagement]', '').trim();
  const source = lines.find((line) => line.startsWith('source:'))?.replace('source:', '').trim() || 'website';
  const page = lines.find((line) => line.startsWith('page:'))?.replace('page:', '').trim() || '/';
  const locale = lines.find((line) => line.startsWith('locale:'))?.replace('locale:', '').trim() || 'fr';
  const details = lines.find((line) => line.startsWith('details:'))?.replace('details:', '').trim();
  const sessionId = lines.find((line) => line.startsWith('session:'))?.replace('session:', '').trim();
  return {
    id: message.id,
    created_at: message.created_at,
    action,
    source,
    page,
    locale,
    details,
    sessionId,
    channel: normalizeEngagementChannel(source, action),
  };
}

export async function listEngagements(filters?: {
  source?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}): Promise<EngagementRecord[]> {
  const messages = await listMessages();
  let engagements = messages.map(parseEngagementMessage).filter(Boolean) as EngagementRecord[];

  if (filters?.source) {
    engagements = engagements.filter((item) => item.source.toLowerCase().includes(filters.source!.toLowerCase()));
  }
  if (filters?.action) {
    engagements = engagements.filter((item) => item.action.toLowerCase().includes(filters.action!.toLowerCase()));
  }
  if (filters?.startDate) {
    const start = new Date(filters.startDate);
    if (!Number.isNaN(start.getTime())) {
      engagements = engagements.filter((item) => new Date(item.created_at) >= start);
    }
  }
  if (filters?.endDate) {
    const end = new Date(filters.endDate);
    if (!Number.isNaN(end.getTime())) {
      const endInclusive = new Date(end);
      endInclusive.setHours(23, 59, 59, 999);
      engagements = engagements.filter((item) => new Date(item.created_at) <= endInclusive);
    }
  }

  return engagements.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function listFaq(locale?: string): Promise<FaqItem[]> {
  if (shouldUseMemory()) return memoryStore.faq.list(locale);

  const supabase = getSupabaseAdmin()!;
  let q = supabase.from('faq_items').select('*').order('order', { ascending: true });
  if (locale) q = q.eq('locale', locale);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapFaq);
}

export async function createFaqItem(item: Omit<FaqItem, 'id'>): Promise<FaqItem> {
  if (shouldUseMemory()) return memoryStore.faq.create(item);

  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from('faq_items')
    .insert({
      locale: item.locale,
      question: item.question,
      answer: item.answer,
      order: item.order,
      published: item.published,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapFaq(data);
}

export async function updateFaqItem(id: string, patch: Partial<FaqItem>): Promise<FaqItem | null> {
  if (shouldUseMemory()) return memoryStore.faq.update(id, patch);

  const supabase = getSupabaseAdmin()!;
  const dbPatch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.locale !== undefined) dbPatch.locale = patch.locale;
  if (patch.question !== undefined) dbPatch.question = patch.question;
  if (patch.answer !== undefined) dbPatch.answer = patch.answer;
  if (patch.order !== undefined) dbPatch.order = patch.order;
  if (patch.published !== undefined) dbPatch.published = patch.published;

  const { data, error } = await supabase.from('faq_items').update(dbPatch).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data ? mapFaq(data) : null;
}

export async function deleteFaqItem(id: string): Promise<boolean> {
  if (shouldUseMemory()) return memoryStore.faq.delete(id);

  const supabase = getSupabaseAdmin()!;
  const { error } = await supabase.from('faq_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export async function saveCookieConsent(sessionId: string, preferences: CookiePreferences): Promise<void> {
  if (shouldUseMemory()) {
    memoryStore.consent.save(sessionId, preferences);
    return;
  }

  const supabase = getSupabaseAdmin()!;
  const now = new Date().toISOString();
  const { error } = await supabase.from('cookie_consents').insert({
    session_id: sessionId,
    preferences,
  });
  if (error) throw new Error(error.message);

  await supabase.from('visitor_sessions').upsert(
    {
      session_id: sessionId,
      first_seen: now,
      last_seen: now,
      pages: [],
      consent_analytics: preferences.analytics,
    },
    { onConflict: 'session_id' }
  );
}

export async function recordPageView(
  sessionId: string,
  page: string,
  locale?: string,
  referrer?: string
): Promise<void> {
  if (shouldUseMemory()) {
    memoryStore.analytics.recordPageView(sessionId, page, locale, referrer, true);
    return;
  }

  const supabase = getSupabaseAdmin()!;
  const now = new Date().toISOString();

  await supabase.from('page_views').insert({
    session_id: sessionId,
    page,
    locale: locale ?? null,
    referrer: referrer ?? null,
  });

  const { data: existing } = await supabase
    .from('visitor_sessions')
    .select('pages')
    .eq('session_id', sessionId)
    .maybeSingle();

  const pages = Array.isArray(existing?.pages) ? [...existing.pages] : [];
  pages.push({ path: page, at: now });

  if (existing) {
    await supabase
      .from('visitor_sessions')
      .update({ last_seen: now, pages, consent_analytics: true })
      .eq('session_id', sessionId);
  } else {
    await supabase.from('visitor_sessions').insert({
      session_id: sessionId,
      first_seen: now,
      last_seen: now,
      pages,
      consent_analytics: true,
    });
  }
}

export async function recordConversionEvent(input: {
  sessionId: string;
  name: string;
  category: 'cta' | 'form' | 'funnel';
  page: string;
  value?: string;
  metadata?: string | null;
}): Promise<void> {
  if (shouldUseMemory()) {
    memoryStore.analytics.recordEvent(input);
    return;
  }

  const supabase = getSupabaseAdmin()!;
  const { error } = await supabase.from('conversion_events').insert({
    session_id: input.sessionId,
    name: input.name,
    category: input.category,
    page: input.page,
    value: input.value ?? null,
    metadata: input.metadata ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function getAnalyticsSummary() {
  if (shouldUseMemory()) return memoryStore.analytics.stats();

  const supabase = getSupabaseAdmin()!;
  const { count: totalPageViews } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true });

  const { count: uniqueSessions } = await supabase
    .from('visitor_sessions')
    .select('*', { count: 'exact', head: true });

  const { data: views } = await supabase.from('page_views').select('page');
  const byPage: Record<string, number> = {};
  for (const v of views ?? []) {
    byPage[v.page] = (byPage[v.page] ?? 0) + 1;
  }

  const { data: events } = await supabase.from('conversion_events').select('name,category');
  const { data: eventPages } = await supabase.from('conversion_events').select('name,page,value');
  const eventsByName: Record<string, number> = {};
  const eventsByPage: Record<string, number> = {};
  let ctaClicks = 0;
  let formSubmits = 0;
  let meetingsBooked = 0;
  const channelFunnels: Record<string, { cta: number; forms: number; total: number }> = {};
  for (const event of events ?? []) {
    eventsByName[event.name] = (eventsByName[event.name] ?? 0) + 1;
    if (event.category === 'cta') ctaClicks += 1;
    if (event.name === 'lead_form_submitted') formSubmits += 1;
    if (event.name === 'meeting_requested') meetingsBooked += 1;
  }
  for (const event of eventPages ?? []) {
    eventsByPage[event.page] = (eventsByPage[event.page] ?? 0) + 1;
    const channel = normalizeEngagementChannel(event.value ?? 'web', event.name);
    channelFunnels[channel] = channelFunnels[channel] ?? { cta: 0, forms: 0, total: 0 };
    channelFunnels[channel].total += 1;
    if (event.name.includes('cta') || event.name.includes('click')) channelFunnels[channel].cta += 1;
    if (event.name.includes('submitted') || event.name.includes('form')) channelFunnels[channel].forms += 1;
  }

  return {
    totalPageViews: totalPageViews ?? 0,
    uniqueSessions: uniqueSessions ?? 0,
    byPage,
    totalEvents: (events ?? []).length,
    eventsByName,
    eventsByPage,
    funnel: {
      ctaClicks,
      formSubmits,
      meetingsBooked,
    },
    funnelByChannel: Object.fromEntries(
      Object.entries(channelFunnels).map(([channel, values]) => {
        const conversionRate = values.cta > 0 ? Number(((values.forms / values.cta) * 100).toFixed(1)) : 0;
        return [channel, { ...values, conversionRate }];
      })
    ),
  };
}

export async function getAdminNotificationSummary() {
  const [leads, messages] = await Promise.all([
    listLeads().catch((error) => {
      console.warn('[crm] leads summary unavailable', error);
      return [] as Lead[];
    }),
    listMessages().catch((error) => {
      console.warn('[crm] messages summary unavailable', error);
      return [] as Message[];
    }),
  ]);
  const newLeads = leads.filter((lead) => lead.status === 'new').length;
  const inboundMessages = messages.filter((message) => message.direction === 'inbound').length;
  return {
    newLeads,
    inboundMessages,
    hasUpdates: newLeads > 0 || inboundMessages > 0,
  };
}

function mapLead(row: Record<string, unknown>): Lead {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    first_name: String(row.first_name),
    last_name: String(row.last_name),
    email: String(row.email),
    phone: row.phone as string | null,
    address: row.address as string | null,
    activity: row.activity as string | null,
    domain: row.domain as string | null,
    message: row.message as string | null,
    source: row.source as string | null,
    status: row.status as Lead['status'],
    whatsapp_clicked: Boolean(row.whatsapp_clicked),
    locale: row.locale as string | null,
    score: row.score !== undefined && row.score !== null ? Number(row.score) : null,
    priority: (row.priority as Lead['priority']) ?? null,
    potential: (row.potential as Lead['potential']) ?? null,
    urgency: (row.urgency as Lead['urgency']) ?? null,
    scoring_details: (row.scoring_details as string | null) ?? null,
  };
}

function mapMessage(row: Record<string, unknown>): Message {
  return {
    id: String(row.id),
    lead_id: row.lead_id as string | null,
    channel: row.channel as Message['channel'],
    body: String(row.body),
    direction: row.direction as Message['direction'],
    created_at: String(row.created_at),
  };
}

function mapFaq(row: Record<string, unknown>): FaqItem {
  return {
    id: String(row.id),
    locale: String(row.locale),
    question: String(row.question),
    answer: String(row.answer),
    order: Number(row.order ?? 0),
    published: Boolean(row.published),
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export {
  createJobOffer,
  createMembership,
  createOrganization,
  createRequestInteraction,
  createServiceRequest,
  createUserProfile,
  createWorkspace,
  deleteJobOffer,
  getServiceRequest,
  listJobOffers,
  listMemberships,
  listOrganizations,
  listRequestInteractions,
  listServiceRequests,
  listUserProfiles,
  listWorkspaces,
  updateUserProfile,
  updateJobOffer,
  updateServiceRequestStatus,
} from './multi-org';
