'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import WhatsAppButton from '@/src/components/forms/WhatsAppButton';
import { trackAnalyticsEvent } from '@/src/lib/analytics-events';
import { getOrCreateSessionId } from '@/src/lib/session';
import { buildWhatsAppUrl } from '@/src/lib/whatsapp';

const inputClass =
  'w-full rounded-lg border border-brand-border/60 bg-brand-panel/50 px-4 py-2.5 text-sm text-white placeholder:text-brand-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent';

type FormMode = 'contact' | 'diagnostic' | 'partner';

type Props = {
  mode?: FormMode;
  source?: string;
  className?: string;
};

export default function ContactLeadForm({ mode = 'contact', source, className = '' }: Props) {
  const locale = useLocale();
  const isFr = locale === 'fr';
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [wantsChecklist, setWantsChecklist] = useState(false);
  const [whatsAppFollowup, setWhatsAppFollowup] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<{ id: string; question: string } | null>(null);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const submissionStartedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    submissionStartedAtRef.current = Date.now();
  }, []);

  const defaultSource =
    source ??
    (mode === 'partner'
      ? 'partnership-diagnostic'
      : mode === 'diagnostic'
      ? 'diagnostic-fast-track'
      : 'contact-form');

  const labels = useMemo(() => {
    if (!isFr) {
      return {
        title:
          mode === 'partner'
            ? 'Partnership diagnostic form'
            : mode === 'diagnostic'
            ? 'Rapid diagnostic form'
            : 'Contact and qualification form',
        subtitle:
          mode === 'partner'
            ? 'Structured answers help us route your request to the right business and technical owners.'
            : 'Tell us your context and priorities. We answer with a practical execution path.',
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        phone: 'Phone',
        activity: 'Industry',
        company: 'Organization',
        message: 'Additional details',
        consent:
          'I agree to be contacted by IMPULCIA AFRIQUE regarding my request. My data is used only for project qualification.',
        checklist: 'I want to receive the IS transformation checklist.',
        submit:
          mode === 'partner' ? 'Submit partnership request' : mode === 'diagnostic' ? 'Submit diagnostic' : 'Send request',
        submitting: 'Submitting...',
        success:
          mode === 'partner'
            ? 'Partnership request submitted. We will get back to you quickly.'
            : 'Request submitted successfully. We will reply within 24 business hours.',
        error: 'An error occurred while submitting the form.',
        projectStage: 'Current maturity',
        objective: 'Primary objective',
        timeline: 'Desired timeline',
        budget: 'Budget range',
        partnerModel: 'Partnership model',
        diagnostics: 'Qualification answers',
      };
    }

    return {
      title:
        mode === 'partner'
          ? 'Formulaire diagnostic partenaire'
          : mode === 'diagnostic'
          ? 'Formulaire diagnostic express'
          : 'Formulaire de contact et qualification',
      subtitle:
        mode === 'partner'
          ? 'Vos reponses structurees nous permettent d activer rapidement le bon binome commercial et technique.'
          : 'Partagez votre contexte et vos priorites. Nous revenons avec un plan d action concret.',
      firstName: 'Prenom',
      lastName: 'Nom',
      email: 'Email',
      phone: 'Telephone',
      activity: 'Secteur',
      company: 'Organisation',
      message: 'Details complementaires',
      consent:
        'J accepte d etre contacte(e) par IMPULCIA AFRIQUE pour le traitement de ma demande. Mes donnees servent uniquement a la qualification.',
      checklist: 'Je souhaite recevoir la checklist transformation SI.',
      submit:
        mode === 'partner'
          ? 'Envoyer la demande de partenariat'
          : mode === 'diagnostic'
          ? 'Soumettre le diagnostic'
          : 'Envoyer la demande',
      submitting: 'Envoi en cours...',
      success:
        mode === 'partner'
          ? 'Demande de partenariat envoyee. Nous revenons vers vous rapidement.'
          : 'Demande envoyee avec succes. Reponse sous 24h ouvrees.',
      error: 'Une erreur est survenue lors de l envoi.',
      projectStage: 'Niveau de maturite actuel',
      objective: 'Objectif principal',
      timeline: 'Delai souhaite',
      budget: 'Fourchette budgetaire',
      partnerModel: 'Mode de partenariat',
      diagnostics: 'Reponses de qualification',
    };
  }, [isFr, mode]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    trackAnalyticsEvent({
      name: 'lead_form_submit_attempt',
      category: 'form',
      value: defaultSource,
    });
    const fd = new FormData(e.currentTarget);
    const sessionId = getOrCreateSessionId();

    const projectStage = String(fd.get('projectStage') || '');
    const objective = String(fd.get('objective') || '');
    const timeline = String(fd.get('timeline') || '');
    const budget = String(fd.get('budget') || '');
    const partnerModel = fd.getAll('partnerModel').map((item) => String(item)).filter(Boolean);
    const company = String(fd.get('company') || '');
    const freeMessage = String(fd.get('message') || '');

    const qualification = [
      `${labels.projectStage}: ${projectStage || '-'}`,
      `${labels.objective}: ${objective || '-'}`,
      `${labels.timeline}: ${timeline || '-'}`,
      `${labels.budget}: ${budget || '-'}`,
      mode === 'partner' ? `${labels.partnerModel}: ${partnerModel.join(', ') || '-'}` : '',
      company ? `${labels.company}: ${company}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const composedMessage = [freeMessage, `[${labels.diagnostics}]`, qualification]
      .filter(Boolean)
      .join('\n\n');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({
          firstName: fd.get('firstName'),
          lastName: fd.get('lastName'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          address: company,
          activity: fd.get('activity'),
          domain: objective || undefined,
          message: composedMessage,
          locale,
          source: defaultSource,
          budget,
          timeline,
          projectStage,
          objective,
          partnerModel,
          consent: fd.get('consent') === 'on',
          wantsChecklist: fd.get('wantsChecklist') === 'on',
          website: fd.get('website'),
          challengeId: challenge?.id,
          challengeAnswer,
          submissionStartedAt: submissionStartedAtRef.current,
        }),
      });
      if (!res.ok) {
        if (res.status === 428) {
          const data = (await res.json().catch(() => null)) as
            | { challenge?: { id: string; question: string } }
            | null;
          setChallenge(data?.challenge ?? null);
          setStatus('idle');
          setErrorMessage(
            isFr
              ? 'Veuillez répondre au contrôle anti-abus pour continuer.'
              : 'Please answer the anti-abuse check to continue.'
          );
          return;
        }
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || 'submit failed');
      }
      setStatus('success');
      e.currentTarget.reset();
      setWantsChecklist(false);
      setChallenge(null);
      setChallengeAnswer('');
      submissionStartedAtRef.current = Date.now();
      const whatsappSummary = isFr
        ? `Nouveau besoin ${mode === 'partner' ? 'partenariat' : 'diagnostic'} soumis via le site IMPULCIA.\n${qualification}`
        : `New ${mode === 'partner' ? 'partnership' : 'diagnostic'} request submitted from IMPULCIA website.\n${qualification}`;
      setWhatsAppFollowup(buildWhatsAppUrl(whatsappSummary));
      trackAnalyticsEvent({
        name: 'lead_form_submitted',
        category: 'funnel',
        value: defaultSource,
      });

      const action = mode === 'partner' ? 'partner_diagnostic_submitted' : 'contact_submitted';
      void fetch('/api/engagement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify({
          action,
          source: defaultSource,
          page: typeof window !== 'undefined' ? window.location.pathname : '/',
          locale,
          details: qualification,
        }),
        keepalive: true,
      });
    } catch {
      setStatus('error');
      setErrorMessage(labels.error);
    }
  }

  const stageOptions = isFr
    ? ['Idee / cadrage initial', 'Projet en cours', 'Plateforme en production a optimiser', 'Refonte complete envisagee']
    : ['Idea / initial scoping', 'Project in progress', 'Live platform to optimize', 'Full rebuild under consideration'];

  const objectiveOptions = isFr
    ? ['Digitaliser un processus metier', 'Lancer une nouvelle plateforme', 'Integrer ERP/CRM/SIRH', 'Automatiser data et reporting']
    : ['Digitize a business process', 'Launch a new platform', 'Integrate ERP/CRM/HRIS', 'Automate data and reporting'];

  const timelineOptions = isFr
    ? ['Urgent (0-30 jours)', 'Court terme (1-3 mois)', 'Moyen terme (3-6 mois)', 'Programme annuel']
    : ['Urgent (0-30 days)', 'Short term (1-3 months)', 'Medium term (3-6 months)', 'Annual program'];

  const budgetOptions = isFr
    ? ['< 5 M FCFA', '5-20 M FCFA', '20-80 M FCFA', '> 80 M FCFA', 'A cadrer ensemble']
    : ['< 5M FCFA', '5-20M FCFA', '20-80M FCFA', '> 80M FCFA', 'To be scoped together'];

  const partnerOptions = isFr
    ? ['Co-delivery projets', 'Distribution solutions', 'Partenariat institutionnel', 'Sous-traitance specialisee']
    : ['Project co-delivery', 'Solution distribution', 'Institutional partnership', 'Specialized subcontracting'];

  return (
    <div className={`grid lg:grid-cols-2 gap-10 items-start ${className}`}>
      <div>
        <h3 className="font-display text-2xl font-bold text-white mb-2">{labels.title}</h3>
        <p className="text-brand-muted text-sm mb-6">{labels.subtitle}</p>
        <WhatsAppButton />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 glass-panel rounded-2xl p-6">
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs text-brand-muted mb-1 block">{labels.firstName} *</span>
            <input name="firstName" required className={inputClass} />
          </label>
          <label className="block">
            <span className="text-xs text-brand-muted mb-1 block">{labels.lastName} *</span>
            <input name="lastName" required className={inputClass} />
          </label>
        </div>
        <label className="block">
          <span className="text-xs text-brand-muted mb-1 block">{labels.email} *</span>
          <input name="email" type="email" required className={inputClass} />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs text-brand-muted mb-1 block">{labels.phone}</span>
            <input name="phone" type="tel" className={inputClass} />
          </label>
          <label className="block">
            <span className="text-xs text-brand-muted mb-1 block">{labels.company}</span>
            <input name="company" className={inputClass} />
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs text-brand-muted mb-1 block">{labels.activity}</span>
            <input name="activity" className={inputClass} />
          </label>
          <label className="block">
            <span className="text-xs text-brand-muted mb-1 block">{labels.projectStage}</span>
            <select name="projectStage" className={inputClass} defaultValue={stageOptions[0]}>
              {stageOptions.map((option) => (
                <option key={option} value={option} className="bg-brand-slate text-white">
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-xs text-brand-muted mb-1 block">{labels.objective}</span>
            <select name="objective" className={inputClass} defaultValue={objectiveOptions[0]}>
              {objectiveOptions.map((option) => (
                <option key={option} value={option} className="bg-brand-slate text-white">
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-brand-muted mb-1 block">{labels.timeline}</span>
            <select name="timeline" className={inputClass} defaultValue={timelineOptions[0]}>
              {timelineOptions.map((option) => (
                <option key={option} value={option} className="bg-brand-slate text-white">
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-brand-muted mb-1 block">{labels.budget}</span>
            <select name="budget" className={inputClass} defaultValue={budgetOptions[0]}>
              {budgetOptions.map((option) => (
                <option key={option} value={option} className="bg-brand-slate text-white">
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        {mode === 'partner' && (
          <fieldset>
            <legend className="text-xs text-brand-muted mb-2 block">{labels.partnerModel}</legend>
            <div className="grid sm:grid-cols-2 gap-2">
              {partnerOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 text-xs text-brand-muted">
                  <input
                    type="checkbox"
                    name="partnerModel"
                    value={option}
                    className="h-4 w-4 accent-brand-accent"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <label className="block">
          <span className="text-xs text-brand-muted mb-1 block">{labels.message}</span>
          <textarea name="message" rows={4} className={inputClass} />
        </label>
        <label className="flex items-start gap-2 text-xs text-brand-muted">
          <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 accent-brand-accent" />
          <span>{labels.consent}</span>
        </label>
        {mode !== 'partner' && (
          <label className="flex items-start gap-2 text-xs text-brand-muted">
            <input
              name="wantsChecklist"
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-brand-accent"
              checked={wantsChecklist}
              onChange={(event) => setWantsChecklist(event.target.checked)}
            />
            <span>{labels.checklist}</span>
          </label>
        )}
        {status === 'success' && <p className="text-sm text-brand-accent">{labels.success}</p>}
        {status === 'error' && <p className="text-sm text-red-400">{errorMessage}</p>}
        {errorMessage && status !== 'error' && (
          <p className="text-sm text-amber-300">{errorMessage}</p>
        )}
        {challenge && (
          <label className="block">
            <span className="text-xs text-brand-muted mb-1 block">
              {isFr ? `Verification: ${challenge.question}` : `Verification: ${challenge.question}`}
            </span>
            <input
              required
              name="challengeAnswer"
              className={inputClass}
              value={challengeAnswer}
              onChange={(event) => setChallengeAnswer(event.target.value)}
            />
          </label>
        )}
        {status === 'success' && wantsChecklist && (
          <a
            href="/resources/checklist-transformation-si-afrique.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm text-brand-accent underline underline-offset-4"
          >
            {isFr ? 'Telecharger la checklist' : 'Download checklist'}
          </a>
        )}
        {status === 'success' && whatsAppFollowup && (
          <a
            href={whatsAppFollowup}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm text-brand-accent underline underline-offset-4"
          >
            {isFr ? 'Preparer le message WhatsApp' : 'Prepare WhatsApp handoff'}
          </a>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-brand-accent text-brand-navy font-semibold text-sm hover:bg-brand-accent-hover disabled:opacity-60 transition"
        >
          {status === 'loading' ? labels.submitting : labels.submit}
        </button>
      </form>
    </div>
  );
}
