'use client';

import { useEffect, useState } from 'react';
import {
  FOUNDERS_TOTAL,
  getFoundersPercent,
  getFoundersRemaining,
  isFoundersSoldOut,
} from '@/lib/founders';
import { useLocaleMessages } from './LocaleProvider';
import { FoundersWaitlist } from './FoundersWaitlist';

type FounderTrackerProps = {
  count: number;
};

function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

export function FounderTracker({ count }: FounderTrackerProps) {
  const { messages: m } = useLocaleMessages();
  const fp = m.foundersPage;
  const soldOut = isFoundersSoldOut(count);
  const remaining = getFoundersRemaining(count);
  const percent = getFoundersPercent(count);
  const [barWidth, setBarWidth] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (soldOut || reduceMotion) {
      setBarWidth(percent);
      return;
    }
    setBarWidth(0);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setBarWidth(percent));
    });
    return () => cancelAnimationFrame(id);
  }, [percent, soldOut, reduceMotion]);

  if (soldOut) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col gap-4 text-center">
        <p
          className="text-4xl sm:text-5xl uppercase tracking-wide leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          {fp.soldOut.title}
        </p>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {fp.soldOut.waitlistHint}
        </p>
        <FoundersWaitlist />
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-md mx-auto rounded-lg border px-5 py-5 sm:px-6"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 sm:gap-4 mb-5">
        <div className="text-center sm:text-left">
          <p
            className="text-4xl sm:text-5xl tabular-nums leading-none"
            style={{ color: 'var(--foreground)' }}
          >
            {count}
          </p>
          <p className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
            {fp.tracker.membersLabel}
          </p>
        </div>
        <div className="text-center sm:text-right">
          <p
            className="text-4xl sm:text-5xl tabular-nums leading-none"
            style={{ color: 'var(--muted)' }}
          >
            {FOUNDERS_TOTAL}
          </p>
          <p className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
            {fp.tracker.totalLabel} · {fp.tracker.totalSuffix}
          </p>
        </div>
      </div>

      <div
        className="h-2 w-full rounded-full overflow-hidden"
        style={{ background: 'var(--border)' }}
        role="progressbar"
        aria-valuenow={count}
        aria-valuemin={0}
        aria-valuemax={FOUNDERS_TOTAL}
        aria-label={interpolate(fp.tracker.remaining, { count: remaining })}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${barWidth}%`,
            background: 'var(--founder-teal)',
            transition: reduceMotion ? 'none' : 'width 600ms ease-out',
          }}
        />
      </div>

      <p className="text-sm text-center mt-3" style={{ color: 'var(--muted)' }}>
        {interpolate(fp.tracker.remaining, { count: remaining })}
      </p>
    </div>
  );
}
