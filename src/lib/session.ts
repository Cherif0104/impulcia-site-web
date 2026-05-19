const SESSION_KEY = 'impulcia_visitor_session';

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getSessionIdFromRequest(headerValue: string | null): string | null {
  if (!headerValue?.trim()) return null;
  return headerValue.trim().slice(0, 128);
}
