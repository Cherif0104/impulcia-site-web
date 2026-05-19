type LeadScoringInput = {
  budget?: string;
  timeline?: string;
  maturity?: string;
  source?: string;
  requestType?: string;
  partnerModel?: string[];
  activity?: string;
};

export type LeadScoringResult = {
  score: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  potential: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  summary: string;
};

function scoreByMap(value: string | undefined, map: Record<string, number>, fallback = 0) {
  if (!value) return fallback;
  const normalized = value.toLowerCase();
  for (const [key, points] of Object.entries(map)) {
    if (normalized.includes(key)) return points;
  }
  return fallback;
}

function scoreSource(source?: string) {
  return scoreByMap(
    source,
    {
      partner: 20,
      refer: 18,
      architect: 16,
      diagnostic: 15,
      contact: 10,
      website: 9,
      social: 7,
      whatsapp: 8,
    },
    6
  );
}

function scoreBudget(budget?: string) {
  return scoreByMap(
    budget,
    {
      '80': 24,
      '20-80': 20,
      '5-20': 14,
      '< 5': 8,
      'to be scoped': 12,
      cadrer: 12,
    },
    10
  );
}

function scoreTimeline(timeline?: string) {
  return scoreByMap(
    timeline,
    {
      urgent: 24,
      '0-30': 24,
      '1-3': 18,
      short: 18,
      '3-6': 12,
      annual: 8,
      annuel: 8,
    },
    10
  );
}

function scoreMaturity(maturity?: string) {
  return scoreByMap(
    maturity,
    {
      production: 20,
      optimise: 18,
      optimize: 18,
      'projet en cours': 16,
      progress: 16,
      refonte: 14,
      rebuild: 14,
      idee: 10,
      idea: 10,
    },
    12
  );
}

function scoreRequestType(requestType?: string) {
  return scoreByMap(
    requestType,
    {
      erp: 18,
      crm: 16,
      sirh: 16,
      hris: 16,
      sig: 15,
      dashboard: 15,
      marketplace: 14,
      mobile: 12,
      web: 12,
      cloud: 11,
      data: 12,
      reporting: 12,
    },
    10
  );
}

export function computeLeadScore(input: LeadScoringInput): LeadScoringResult {
  const sourceScore = scoreSource(input.source);
  const budgetScore = scoreBudget(input.budget);
  const timelineScore = scoreTimeline(input.timeline);
  const maturityScore = scoreMaturity(input.maturity);
  const requestTypeScore = scoreRequestType(input.requestType);
  const partnerBonus = Math.min((input.partnerModel?.length ?? 0) * 3, 9);
  const strategicActivityBonus = scoreByMap(input.activity, {
    institution: 4,
    gouvernement: 4,
    government: 4,
    ngo: 3,
    banque: 3,
    finance: 3,
  });

  const rawScore =
    sourceScore + budgetScore + timelineScore + maturityScore + requestTypeScore + partnerBonus + strategicActivityBonus;
  const score = Math.max(0, Math.min(100, rawScore));

  const priority =
    score >= 80 ? 'critical' : score >= 62 ? 'high' : score >= 42 ? 'medium' : 'low';
  const potential = budgetScore + requestTypeScore + sourceScore >= 50 ? 'high' : score >= 45 ? 'medium' : 'low';
  const urgency = timelineScore >= 20 ? 'high' : timelineScore >= 12 ? 'medium' : 'low';

  const summary = [
    `source=${sourceScore}`,
    `budget=${budgetScore}`,
    `timeline=${timelineScore}`,
    `maturity=${maturityScore}`,
    `request=${requestTypeScore}`,
    partnerBonus ? `partnerBonus=${partnerBonus}` : '',
    strategicActivityBonus ? `activityBonus=${strategicActivityBonus}` : '',
  ]
    .filter(Boolean)
    .join('; ');

  return { score, priority, potential, urgency, summary };
}

