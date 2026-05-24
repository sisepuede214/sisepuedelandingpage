'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LanguageToggle } from './LanguageToggle';
import { TrackedLink } from './TrackedLink';
import { useLocaleMessages } from './LocaleProvider';

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function FoundersPageNav() {
  const { messages: m, locale } = useLocaleMessages();
  const fp = m.foundersPage;

  return (
    <nav
      className="flex items-center justify-between px-5 sm:px-6 py-4 max-w-3xl mx-auto w-full border-b"
      style={{ borderColor: 'var(--border)' }}
    >
      <Link href={`/${locale}`} aria-label={fp.nav.homeAria}>
        <Image
          src="/SISELOGOblack.png"
          alt="SISE"
          width={120}
          height={48}
          className="h-8 w-auto"
          priority
        />
      </Link>
      <div className="flex items-center gap-4">
        <LanguageToggle />
        <TrackedLink
          href="https://www.instagram.com/sisepuede1.0/"
          eventName="cta_instagram_clicked"
          eventProperties={{ cta_location: 'founders_header_nav' }}
          target="_blank"
          rel="noopener noreferrer"
          ariaLabel={m.nav.instagramAria}
          className="transition-opacity hover:opacity-70"
          style={{ color: 'var(--muted)' }}
        >
          <InstagramIcon />
        </TrackedLink>
      </div>
    </nav>
  );
}
