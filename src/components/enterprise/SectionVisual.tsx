'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { getEnterpriseSectionVisual } from '@/src/lib/media';

type SectionVisualProps = {
  visualKey: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export default function SectionVisual({
  visualKey,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 1024px) 100vw, 1200px',
}: SectionVisualProps) {
  const preferredSrc = useMemo(() => getEnterpriseSectionVisual(visualKey), [visualKey]);
  const fallbackSrc = useMemo(() => getEnterpriseSectionVisual('default'), []);
  const [src, setSrc] = useState(preferredSrc);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-brand-border/60 bg-brand-panel/40 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        priority={priority}
        onError={() => setSrc(fallbackSrc)}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/30 via-transparent to-transparent" />
    </div>
  );
}
