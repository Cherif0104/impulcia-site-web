type OutgoingWebhookEventType = 'lead.created' | 'engagement.created';

type OutgoingWebhookPayload = {
  type: OutgoingWebhookEventType;
  timestamp: string;
  source: string;
  data: Record<string, unknown>;
};

function isEnabled() {
  return process.env.WHATSAPP_OUTGOING_WEBHOOK_ENABLED === 'true';
}

function getWebhookConfig() {
  const url = process.env.WHATSAPP_OUTGOING_WEBHOOK_URL?.trim() ?? '';
  const token = process.env.WHATSAPP_OUTGOING_WEBHOOK_TOKEN?.trim() ?? '';
  return { url, token };
}

export async function sendOutgoingWebhook(payload: OutgoingWebhookPayload): Promise<void> {
  if (!isEnabled()) {
    console.info('[outgoing-webhook] disabled by feature flag');
    return;
  }

  const { url, token } = getWebhookConfig();
  if (!url) {
    console.warn('[outgoing-webhook] missing WHATSAPP_OUTGOING_WEBHOOK_URL, skipping');
    return;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-impulcia-webhook-event': payload.type,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error('[outgoing-webhook] failed', response.status, errorBody);
      return;
    }

    console.info('[outgoing-webhook] delivered', payload.type);
  } catch (error) {
    console.error('[outgoing-webhook] request error', error);
  }
}

export function buildLeadWebhookPayload(input: {
  leadId: string;
  source: string;
  email: string;
  locale: string;
  score: number;
  priority: string;
  potential: string;
  urgency: string;
}) {
  return {
    type: 'lead.created' as const,
    timestamp: new Date().toISOString(),
    source: input.source,
    data: {
      leadId: input.leadId,
      email: input.email,
      locale: input.locale,
      scoring: {
        score: input.score,
        priority: input.priority,
        potential: input.potential,
        urgency: input.urgency,
      },
    },
  };
}

export function buildEngagementWebhookPayload(input: {
  action: string;
  source: string;
  page: string;
  locale: string;
  sessionId: string | null;
}) {
  return {
    type: 'engagement.created' as const,
    timestamp: new Date().toISOString(),
    source: input.source,
    data: {
      action: input.action,
      page: input.page,
      locale: input.locale,
      sessionId: input.sessionId,
    },
  };
}

