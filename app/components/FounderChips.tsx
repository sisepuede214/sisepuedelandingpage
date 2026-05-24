'use client';

import { useEffect, useRef, useState } from 'react';
import {
  formatFounderNumber,
  getFoundersRemaining,
  isFoundersSoldOut,
} from '@/lib/founders';
import { useLocaleMessages } from './LocaleProvider';

type FounderChipsProps = {
  count: number;
  maxDisplay?: number;
};

function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

export function FounderChips({ count, maxDisplay = 30 }: FounderChipsProps) {
  const { messages: m } = useLocaleMessages();
  const fp = m.foundersPage.chips;
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const soldOut = isFoundersSoldOut(count);
  const remaining = getFoundersRemaining(count);
  const displayed = Math.min(count, maxDisplay);
  const nextNumber = count + 1;

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  if (soldOut) return null;

  const chipBase =
    'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium tabular-nums';

  return (
    <div ref={containerRef}>
      <p className="text-[15px] leading-relaxed mb-4" style={{ color: 'var(--foreground)' }}>
        {interpolate(fp.intro, { count })}
      </p>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: displayed }, (_, i) => {
          const num = i + 1;
          return (
            <span
              key={num}
              className={chipBase}
              style={{
                background: 'var(--founder-teal-light)',
                color: 'var(--founder-teal-dark)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(6px)',
                transition: reduceMotion
                  ? 'none'
                  : `opacity 400ms ease-out ${i * 40}ms, transform 400ms ease-out ${i * 40}ms`,
              }}
            >
              {formatFounderNumber(num)}
            </span>
          );
        })}

        {count > maxDisplay && (
          <span
            className={chipBase}
            style={{
              background: 'var(--founder-teal-light)',
              color: 'var(--founder-teal-dark)',
              opacity: visible ? 1 : 0,
            }}
          >
            {interpolate(fp.more, { count: count - maxDisplay })}
          </span>
        )}

        <span
          className={chipBase}
          style={{
            background: 'var(--founder-chip-bg)',
            color: 'var(--founder-chip-text)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(6px)',
            transition: reduceMotion
              ? 'none'
              : `opacity 400ms ease-out ${displayed * 40}ms, transform 400ms ease-out ${displayed * 40}ms`,
          }}
        >
          {formatFounderNumber(nextNumber)} {fp.youChip}
        </span>

        <span
          className={chipBase}
          style={{
            background: 'var(--border)',
            color: 'var(--muted)',
            opacity: visible ? 1 : 0,
          }}
        >
          {interpolate(fp.spotsOpen, { count: remaining })}
        </span>
      </div>

      <p className="text-xs mt-4" style={{ color: 'var(--muted)' }}>
        {fp.footnote}
      </p>
    </div>
  );
}
