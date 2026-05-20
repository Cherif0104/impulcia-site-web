'use client';

import Image from 'next/image';
import { marqueeLabel } from '@/src/lib/enterprise-taxonomy';

export type MarqueeItem = {
  id: string;
  label: string;
  src?: string;
  subtitle?: string;
};

type MarqueeRow = {
  id: string;
  direction: 'left' | 'right';
  durationSec: number;
  items: MarqueeItem[];
};

type AsyncMarqueeRowsProps = {
  rows: MarqueeRow[];
  locale: string;
  className?: string;
  itemClassName?: string;
};

function MarqueeTrack({
  items,
  direction,
  durationSec,
  itemClassName,
}: {
  items: MarqueeItem[];
  direction: 'left' | 'right';
  durationSec: number;
  itemClassName?: string;
}) {
  const duplicated = [...items, ...items];

  return (
    <div className="marquee-row group">
      <div
        className={`marquee-track ${direction === 'left' ? 'marquee-left' : 'marquee-right'} group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${durationSec}s` }}
      >
        {duplicated.map((item, index) => (
          <article
            key={`${item.id}-${index}`}
            className={`marquee-item rounded-xl border border-brand-border/50 bg-brand-panel/70 px-4 py-3 ${itemClassName ?? ''}`}
            aria-label={item.subtitle ? `${item.label} - ${item.subtitle}` : item.label}
          >
            <div className="flex items-center gap-3 min-w-[180px]">
              {item.src ? (
                <div className="h-8 w-8 rounded-md bg-white/95 p-1.5 flex items-center justify-center shrink-0">
                  <Image src={item.src} alt={item.label} width={22} height={22} className="object-contain" />
                </div>
              ) : null}
              <div>
                <p className="text-sm font-medium text-white whitespace-nowrap">{item.label}</p>
                {item.subtitle ? <p className="text-[11px] text-brand-muted whitespace-nowrap">{item.subtitle}</p> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function AsyncMarqueeRows({
  rows,
  locale,
  className,
  itemClassName,
}: AsyncMarqueeRowsProps) {
  return (
    <div className={className}>
      <span className="sr-only">{locale === 'fr' ? marqueeLabel.fr : marqueeLabel.en}</span>
      <div className="space-y-3">
        {rows.map((row) => (
          <MarqueeTrack
            key={row.id}
            items={row.items}
            direction={row.direction}
            durationSec={row.durationSec}
            itemClassName={itemClassName}
          />
        ))}
      </div>
    </div>
  );
}
