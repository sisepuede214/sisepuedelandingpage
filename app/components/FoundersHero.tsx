'use client';

import { Children, type ReactNode } from 'react';
import { useEffect, useState } from 'react';

type FoundersHeroProps = {
  children: ReactNode;
};

const STAGGER_MS = 100;

export function FoundersHero({ children }: FoundersHeroProps) {
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(true);
    }
  }, []);

  const items = Children.toArray(children);

  return (
    <section className="flex flex-col items-center text-center gap-6 sm:gap-8 py-12 sm:py-14 px-5 sm:px-6 max-w-3xl mx-auto w-full">
      {items.length > 0
        ? items.map((child, i) => (
            <div
              key={i}
              className="w-full flex flex-col items-center"
              style={{
                opacity: mounted || reduceMotion ? 1 : 0,
                transform: mounted || reduceMotion ? 'translateY(0)' : 'translateY(12px)',
                transition: reduceMotion
                  ? 'none'
                  : `opacity 500ms ease-out ${i * STAGGER_MS}ms, transform 500ms ease-out ${i * STAGGER_MS}ms`,
              }}
            >
              {child}
            </div>
          ))
        : null}
    </section>
  );
}
