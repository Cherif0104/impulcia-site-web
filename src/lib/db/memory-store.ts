import type {
  CookiePreferences,
  FaqItem,
  JobOffer,
  Lead,
  Membership,
  Message,
  Organization,
  RequestInteraction,
  ServiceRequest,
  UserProfile,
  Workspace,
} from '@/src/types/crm';

let warned = false;

export function warnMemoryFallback() {
  if (!warned && process.env.NODE_ENV !== 'production') {
    console.warn(
      '[IMPULCIA CRM] Supabase non configuré — données en mémoire (perdues au redémarrage). Définissez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.'
    );
    warned = true;
  }
}

const leads: Lead[] = [];
const messages: Message[] = [];
const faqItems: FaqItem[] = [
  {
    id: 'faq-1',
    locale: 'fr',
    question: 'Qu’est-ce que COYA ERP ?',
    answer:
      'COYA ERP est la plateforme de gestion intégrée d’IMPULCIA AFRIQUE pour PME et institutions en Afrique.',
    order: 1,
    published: true,
  },
  {
    id: 'faq-2',
    locale: 'en',
    question: 'What is COYA ERP?',
    answer:
      'COYA ERP is IMPULCIA AFRIQUE’s integrated management platform for SMEs and institutions across Africa.',
    order: 1,
    published: true,
  },
];
const cookieConsents: { id: string; session_id: string; preferences: CookiePreferences; created_at: string }[] = [];
const visitorSessions = new Map<
  string,
  { session_id: string; first_seen: string; last_seen: string; pages: { path: string; at: string }[]; consent_analytics: boolean }
>();
const pageViews: { session_id: string; page: string; locale?: string; referrer?: string; created_at: string }[] = [];
const conversionEvents: {
  session_id: string;
  name: string;
  category: 'cta' | 'form' | 'funnel';
  page: string;
  value?: string;
  metadata?: string | null;
  created_at: string;
}[] = [];
const organizations: Organization[] = [];
const workspaces: Workspace[] = [];
const userProfiles: UserProfile[] = [];
const memberships: Membership[] = [];
const serviceRequests: ServiceRequest[] = [];
const requestInteractions: RequestInteraction[] = [];
const jobOffers: JobOffer[] = [];

function uid(): string {
  return `mem_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const memoryStore = {
  leads: {
    list: () => [...leads].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    get: (id: string) => leads.find((l) => l.id === id) ?? null,
    create: (
      data: Omit<Lead, 'id' | 'created_at' | 'status' | 'whatsapp_clicked'> &
        Partial<Pick<Lead, 'status' | 'whatsapp_clicked'>>
    ) => {
      const lead: Lead = {
        id: uid(),
        created_at: new Date().toISOString(),
        status: 'new',
        whatsapp_clicked: false,
        score: null,
        priority: null,
        potential: null,
        urgency: null,
        scoring_details: null,
        ...data,
      };
      leads.push(lead);
      return lead;
    },
    update: (id: string, patch: Partial<Lead>) => {
      const i = leads.findIndex((l) => l.id === id);
      if (i < 0) return null;
      leads[i] = { ...leads[i], ...patch };
      return leads[i];
    },
  },
  messages: {
    list: (leadId?: string) => {
      const list = [...messages].sort((a, b) => b.created_at.localeCompare(a.created_at));
      return leadId ? list.filter((m) => m.lead_id === leadId) : list;
    },
    create: (data: Omit<Message, 'id' | 'created_at'>) => {
      const msg: Message = { id: uid(), created_at: new Date().toISOString(), ...data };
      messages.push(msg);
      return msg;
    },
  },
  faq: {
    list: (locale?: string) => {
      let list = [...faqItems].sort((a, b) => a.order - b.order);
      if (locale) list = list.filter((f) => f.locale === locale);
      return list;
    },
    get: (id: string) => faqItems.find((f) => f.id === id) ?? null,
    create: (data: Omit<FaqItem, 'id'>) => {
      const item: FaqItem = { id: uid(), ...data };
      faqItems.push(item);
      return item;
    },
    update: (id: string, patch: Partial<FaqItem>) => {
      const i = faqItems.findIndex((f) => f.id === id);
      if (i < 0) return null;
      faqItems[i] = { ...faqItems[i], ...patch };
      return faqItems[i];
    },
    delete: (id: string) => {
      const i = faqItems.findIndex((f) => f.id === id);
      if (i < 0) return false;
      faqItems.splice(i, 1);
      return true;
    },
  },
  consent: {
    save: (sessionId: string, preferences: CookiePreferences) => {
      const now = new Date().toISOString();
      cookieConsents.push({
        id: uid(),
        session_id: sessionId,
        preferences,
        created_at: now,
      });

      const existing = visitorSessions.get(sessionId);
      if (existing) {
        existing.last_seen = now;
        existing.consent_analytics = preferences.analytics;
      } else {
        visitorSessions.set(sessionId, {
          session_id: sessionId,
          first_seen: now,
          last_seen: now,
          pages: [],
          consent_analytics: preferences.analytics,
        });
      }
    },
  },
  analytics: {
    recordPageView: (sessionId: string, page: string, locale?: string, referrer?: string, consentAnalytics = true) => {
      const now = new Date().toISOString();
      let vs = visitorSessions.get(sessionId);
      if (!vs) {
        vs = { session_id: sessionId, first_seen: now, last_seen: now, pages: [], consent_analytics: consentAnalytics };
        visitorSessions.set(sessionId, vs);
      }
      vs.last_seen = now;
      vs.consent_analytics = consentAnalytics;
      vs.pages.push({ path: page, at: now });
      pageViews.push({ session_id: sessionId, page, locale, referrer, created_at: now });
    },
    stats: () => {
      const byPage = new Map<string, number>();
      for (const pv of pageViews) {
        byPage.set(pv.page, (byPage.get(pv.page) ?? 0) + 1);
      }

      const eventsByName = new Map<string, number>();
      const eventsByPage = new Map<string, number>();
      const funnelByChannel = new Map<string, { cta: number; forms: number; total: number }>();
      for (const event of conversionEvents) {
        eventsByName.set(event.name, (eventsByName.get(event.name) ?? 0) + 1);
        eventsByPage.set(event.page, (eventsByPage.get(event.page) ?? 0) + 1);
        const channelRaw = `${event.value ?? ''} ${event.name}`.toLowerCase();
        const channel = channelRaw.includes('whatsapp')
          ? 'whatsapp'
          : channelRaw.includes('partner')
          ? 'partner'
          : channelRaw.includes('contact')
          ? 'contact'
          : channelRaw.includes('web') || channelRaw === ''
          ? 'web'
          : 'other';
        const current = funnelByChannel.get(channel) ?? { cta: 0, forms: 0, total: 0 };
        current.total += 1;
        if (event.name.includes('cta') || event.name.includes('click')) current.cta += 1;
        if (event.name.includes('submitted') || event.name.includes('form')) current.forms += 1;
        funnelByChannel.set(channel, current);
      }

      const ctaClicks = conversionEvents.filter((e) => e.category === 'cta').length;
      const formSubmits = conversionEvents.filter((e) => e.name === 'lead_form_submitted').length;
      const meetingsBooked = conversionEvents.filter((e) => e.name === 'meeting_requested').length;
      return {
        totalPageViews: pageViews.length,
        uniqueSessions: visitorSessions.size,
        byPage: Object.fromEntries(byPage),
        totalEvents: conversionEvents.length,
        eventsByName: Object.fromEntries(eventsByName),
        eventsByPage: Object.fromEntries(eventsByPage),
        funnel: {
          ctaClicks,
          formSubmits,
          meetingsBooked,
        },
        funnelByChannel: Object.fromEntries(
          Array.from(funnelByChannel.entries()).map(([channel, values]) => {
            const conversionRate = values.cta > 0 ? Number(((values.forms / values.cta) * 100).toFixed(1)) : 0;
            return [channel, { ...values, conversionRate }];
          })
        ),
      };
    },
    recordEvent: (event: {
      sessionId: string;
      name: string;
      category: 'cta' | 'form' | 'funnel';
      page: string;
      value?: string;
      metadata?: string | null;
    }) => {
      conversionEvents.push({
        session_id: event.sessionId,
        name: event.name,
        category: event.category,
        page: event.page,
        value: event.value,
        metadata: event.metadata,
        created_at: new Date().toISOString(),
      });
    },
  },
  organizations: {
    list: () => [...organizations].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    create: (data: {
      name: string;
      slug: string;
      type: Organization['type'];
      parent_org_id?: string | null;
      active?: boolean;
    }) => {
      const row: Organization = {
        id: uid(),
        created_at: new Date().toISOString(),
        active: data.active ?? true,
        parent_org_id: data.parent_org_id ?? null,
        name: data.name,
        slug: data.slug,
        type: data.type,
      };
      organizations.push(row);
      return row;
    },
  },
  workspaces: {
    list: (organizationId?: string) => {
      const rows = [...workspaces].sort((a, b) => b.created_at.localeCompare(a.created_at));
      return organizationId ? rows.filter((item) => item.organization_id === organizationId) : rows;
    },
    create: (data: {
      organization_id: string;
      name: string;
      slug: string;
      status?: Workspace['status'];
    }) => {
      const row: Workspace = {
        id: uid(),
        created_at: new Date().toISOString(),
        organization_id: data.organization_id,
        name: data.name,
        slug: data.slug,
        status: data.status ?? 'active',
      };
      workspaces.push(row);
      return row;
    },
  },
  userProfiles: {
    list: () => [...userProfiles].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    create: (data: { email: string; display_name: string; role_hint?: string | null }) => {
      const row: UserProfile = {
        id: uid(),
        created_at: new Date().toISOString(),
        email: data.email,
        display_name: data.display_name,
        role_hint: data.role_hint ?? null,
      };
      userProfiles.push(row);
      return row;
    },
    update: (id: string, patch: Partial<Pick<UserProfile, 'display_name' | 'role_hint'>>) => {
      const index = userProfiles.findIndex((item) => item.id === id);
      if (index < 0) return null;
      userProfiles[index] = {
        ...userProfiles[index],
        ...(patch.display_name !== undefined ? { display_name: patch.display_name } : {}),
        ...(patch.role_hint !== undefined ? { role_hint: patch.role_hint } : {}),
      };
      return userProfiles[index];
    },
  },
  memberships: {
    list: () => [...memberships].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    create: (data: {
      user_profile_id: string;
      organization_id?: string | null;
      workspace_id?: string | null;
      role: Membership['role'];
    }) => {
      const row: Membership = {
        id: uid(),
        created_at: new Date().toISOString(),
        user_profile_id: data.user_profile_id,
        organization_id: data.organization_id ?? null,
        workspace_id: data.workspace_id ?? null,
        role: data.role,
        user_profile: userProfiles.find((item) => item.id === data.user_profile_id) ?? null,
        organization: data.organization_id
          ? organizations.find((item) => item.id === data.organization_id) ?? null
          : null,
        workspace: data.workspace_id ? workspaces.find((item) => item.id === data.workspace_id) ?? null : null,
      };
      memberships.push(row);
      return row;
    },
  },
  requests: {
    list: (workspaceId?: string) => {
      const rows = [...serviceRequests].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
      return workspaceId ? rows.filter((item) => item.workspace_id === workspaceId) : rows;
    },
    create: (data: {
      workspace_id: string;
      organization_id: string;
      title: string;
      description?: string | null;
      priority?: ServiceRequest['priority'];
      status?: ServiceRequest['status'];
      created_by_email?: string | null;
      assigned_membership_id?: string | null;
    }) => {
      const now = new Date().toISOString();
      const row: ServiceRequest = {
        id: uid(),
        created_at: now,
        updated_at: now,
        workspace_id: data.workspace_id,
        organization_id: data.organization_id,
        title: data.title,
        description: data.description ?? null,
        status: data.status ?? 'new',
        priority: data.priority ?? 'medium',
        created_by_email: data.created_by_email ?? null,
        assigned_membership_id: data.assigned_membership_id ?? null,
      };
      serviceRequests.push(row);
      return row;
    },
    updateStatus: (id: string, status: ServiceRequest['status']) => {
      const index = serviceRequests.findIndex((item) => item.id === id);
      if (index < 0) return null;
      serviceRequests[index] = {
        ...serviceRequests[index],
        status,
        updated_at: new Date().toISOString(),
      };
      return serviceRequests[index];
    },
  },
  requestInteractions: {
    list: (requestId: string) =>
      requestInteractions
        .filter((item) => item.request_id === requestId)
        .sort((a, b) => a.created_at.localeCompare(b.created_at)),
    create: (data: { request_id: string; author_type: RequestInteraction['author_type']; body: string }) => {
      const row: RequestInteraction = {
        id: uid(),
        created_at: new Date().toISOString(),
        request_id: data.request_id,
        author_type: data.author_type,
        body: data.body,
      };
      requestInteractions.push(row);
      return row;
    },
  },
  jobOffers: {
    list: (publishedOnly = false) => {
      const rows = [...jobOffers].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
      return publishedOnly ? rows.filter((item) => item.published) : rows;
    },
    create: (data: {
      title: string;
      slug: string;
      location?: string | null;
      employment_type: JobOffer['employment_type'];
      team?: string | null;
      description: string;
      published?: boolean;
      published_at?: string | null;
    }) => {
      const now = new Date().toISOString();
      const row: JobOffer = {
        id: uid(),
        created_at: now,
        updated_at: now,
        title: data.title,
        slug: data.slug,
        location: data.location ?? null,
        employment_type: data.employment_type,
        team: data.team ?? null,
        description: data.description,
        published: data.published ?? false,
        published_at: data.published_at ?? null,
      };
      jobOffers.push(row);
      return row;
    },
    update: (id: string, patch: Partial<JobOffer>) => {
      const index = jobOffers.findIndex((item) => item.id === id);
      if (index < 0) return null;
      jobOffers[index] = {
        ...jobOffers[index],
        ...patch,
        updated_at: new Date().toISOString(),
      };
      return jobOffers[index];
    },
    delete: (id: string) => {
      const index = jobOffers.findIndex((item) => item.id === id);
      if (index < 0) return false;
      jobOffers.splice(index, 1);
      return true;
    },
  },
};
