'use client';

import type { CSSProperties, ReactNode } from 'react';
import posthog from 'posthog-js';

type TrackedLinkProps = {
  href: string;
  children: ReactNode;
  eventName: string;
  eventProperties?: Record<string, unknown>;
  className?: string;
  style?: CSSProperties;
  target?: string;
  rel?: string;
  ariaLabel?: string;
};

export function TrackedLink({
  href,
  children,
  eventName,
  eventProperties,
  className,
  style,
  target,
  rel,
  ariaLabel,
}: TrackedLinkProps) {
  function handleClick() {
    posthog.capture(eventName, eventProperties);
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      style={style}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
