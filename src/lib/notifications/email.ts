type LeadConfirmationInput = {
  to: string;
  firstName: string;
  locale: 'fr' | 'en';
  leadId: string;
};

function isConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.LEADS_CONFIRMATION_FROM_EMAIL?.trim()
  );
}

function buildMessage(input: LeadConfirmationInput) {
  if (input.locale === 'en') {
    return {
      subject: 'We received your request - IMPULCIA AFRIQUE',
      html: `
        <p>Hello ${input.firstName},</p>
        <p>Thank you for your request. Our team has received it and will respond within one business day.</p>
        <p><strong>Next steps:</strong></p>
        <ul>
          <li>Qualification review by an IMPULCIA consultant</li>
          <li>Proposed next meeting or written recommendation</li>
          <li>Delivery plan aligned with your priorities</li>
        </ul>
        <p>Reference: ${input.leadId}</p>
      `,
      text: `Hello ${input.firstName},

Thank you for your request. Our team has received it and will respond within one business day.

Next steps:
- Qualification review by an IMPULCIA consultant
- Proposed next meeting or written recommendation
- Delivery plan aligned with your priorities

Reference: ${input.leadId}`,
    };
  }

  return {
    subject: 'Demande reçue - IMPULCIA AFRIQUE',
    html: `
      <p>Bonjour ${input.firstName},</p>
      <p>Merci pour votre demande. Notre équipe l'a bien reçue et vous répondra sous un jour ouvré.</p>
      <p><strong>Prochaines étapes :</strong></p>
      <ul>
        <li>Qualification rapide de votre besoin par un consultant IMPULCIA</li>
        <li>Proposition de rendez-vous ou de recommandation écrite</li>
        <li>Plan d'intervention aligné avec vos priorités</li>
      </ul>
      <p>Référence: ${input.leadId}</p>
    `,
    text: `Bonjour ${input.firstName},

Merci pour votre demande. Notre équipe l'a bien reçue et vous répondra sous un jour ouvré.

Prochaines étapes :
- Qualification rapide de votre besoin par un consultant IMPULCIA
- Proposition de rendez-vous ou de recommandation écrite
- Plan d'intervention aligné avec vos priorités

Référence: ${input.leadId}`,
  };
}

export async function sendLeadConfirmationEmail(input: LeadConfirmationInput): Promise<void> {
  if (!isConfigured()) {
    console.info('[lead-email] provider not configured, fallback to internal log', {
      to: input.to,
      leadId: input.leadId,
      locale: input.locale,
    });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = process.env.LEADS_CONFIRMATION_FROM_EMAIL!.trim();
  const message = buildMessage(input);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error('[lead-email] failed', response.status, errorBody);
      return;
    }

    console.info('[lead-email] confirmation sent', { to: input.to, leadId: input.leadId });
  } catch (error) {
    console.error('[lead-email] request error', error);
  }
}

