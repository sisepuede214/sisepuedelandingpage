'use client';

import { useEffect, useState } from 'react';
import { preorderOpensDate } from '@/lib/campaign';
import type { Messages } from '@/lib/i18n/messages';

const TARGET = preorderOpensDate();

type CountdownLabels = Messages['countdown'];

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft | null {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function CountdownTimer({ labels }: { labels: CountdownLabels }) {
  // Avoid Date.now() during SSR / first paint — server and client clocks differ → hydration mismatch.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calcTimeLeft());
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) return null;

  const units = [
    { value: timeLeft.days, label: labels.days },
    { value: timeLeft.hours, label: labels.hours },
    { value: timeLeft.minutes, label: labels.minutes },
    { value: timeLeft.seconds, label: labels.seconds },
  ];

  return (
    <div className="flex items-center gap-4 sm:gap-6" aria-label={labels.aria}>
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-4xl sm:text-5xl font-black leading-none tabular-nums"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
            >
              {pad(unit.value)}
            </span>
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--muted)' }}
            >
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span
              className="text-2xl font-light mb-4"
              style={{ color: 'var(--border)' }}
              aria-hidden="true"
            >
              ·
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
