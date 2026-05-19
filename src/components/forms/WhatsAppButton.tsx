'use client';

import { useTranslations } from 'next-intl';
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from '@/src/lib/whatsapp';
import WhatsAppIcon from '@/src/components/icons/WhatsAppIcon';

type Props = {
  prefillKey?: string;
  prefillText?: string;
  label?: string;
  includeNumber?: boolean;
  className?: string;
  onClick?: () => void;
};

export default function WhatsAppButton({
  prefillKey = 'whatsappPrefill',
  prefillText,
  label,
  includeNumber = true,
  className = '',
  onClick,
}: Props) {
  const t = useTranslations('legal.form');
  const text = prefillText ?? t(prefillKey as 'whatsappPrefill');
  const href = buildWhatsAppUrl(text);
  const ctaLabel = label ?? t('whatsapp');

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] font-medium text-sm hover:bg-[#25D366]/20 transition ${className}`}
    >
      <WhatsAppIcon className="h-4 w-4" />
      <span>{ctaLabel}</span>
      {includeNumber ? <span className="text-xs opacity-90">· {WHATSAPP_DISPLAY}</span> : null}
    </a>
  );
}
