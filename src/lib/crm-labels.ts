import type { RequestStatus } from '@/src/types/crm';

export const REQUEST_STATUSES: RequestStatus[] = [
  'new',
  'triaged',
  'in_progress',
  'blocked',
  'done',
];

export type RequestPriority = 'low' | 'medium' | 'high' | 'critical';

export const REQUEST_PRIORITIES: RequestPriority[] = ['low', 'medium', 'high', 'critical'];

/** URL query value for all non-done requests (not a DB enum). */
export const OPEN_REQUESTS_QUERY = 'open';

export function requestStatusLabel(status: RequestStatus, isFr: boolean): string {
  if (isFr) {
    const labels: Record<RequestStatus, string> = {
      new: 'Nouvelle',
      triaged: 'Qualifiée',
      in_progress: 'En cours',
      blocked: 'Bloquée',
      done: 'Terminée',
    };
    return labels[status];
  }
  const labels: Record<RequestStatus, string> = {
    new: 'New',
    triaged: 'Triaged',
    in_progress: 'In progress',
    blocked: 'Blocked',
    done: 'Done',
  };
  return labels[status];
}

export function requestPriorityLabel(priority: RequestPriority, isFr: boolean): string {
  if (isFr) {
    const labels: Record<RequestPriority, string> = {
      low: 'Basse',
      medium: 'Normale',
      high: 'Haute',
      critical: 'Critique',
    };
    return labels[priority];
  }
  const labels: Record<RequestPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };
  return labels[priority];
}

export function interactionAuthorLabel(authorType: string, isFr: boolean): string {
  if (authorType === 'client') return isFr ? 'Vous' : 'You';
  if (authorType === 'staff') return isFr ? 'Équipe IMPULCIA' : 'IMPULCIA team';
  return authorType;
}
