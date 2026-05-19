'use client';

import { getOrCreateSessionId } from '@/src/lib/session';

const CTA_COOKIE = 'impulcia_cta_variant';
const COOKIE_TTL_DAYS = 30;

export type CtaVariant = 'A' | 'B';

function parseVariant(value: string | undefined): CtaVariant | null {
  if (value === 'A' || value === 'B') return value;
  return null;
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const parts = document.cookie.split(';').map((part) => part.trim());
  const target = parts.find((part) => part.startsWith(`${name}=`));
  return target ? decodeURIComponent(target.slice(name.length + 1)) : undefined;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 33 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getDeterministicCtaVariant(): CtaVariant {
  const cookieVariant = parseVariant(getCookie(CTA_COOKIE));
  if (cookieVariant) return cookieVariant;

  const sessionId = getOrCreateSessionId();
  const variant: CtaVariant = hash(sessionId) % 2 === 0 ? 'A' : 'B';
  setCookie(CTA_COOKIE, variant, COOKIE_TTL_DAYS);
  return variant;
}

