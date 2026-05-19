const WHATSAPP_NUMBER = '221788324069';

export function buildWhatsAppUrl(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!text?.trim()) return base;
  return `${base}?text=${encodeURIComponent(text.trim())}`;
}

export const WHATSAPP_DISPLAY = '+221 78 832 40 69';
