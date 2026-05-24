'use client';

import { TrackedLink } from './TrackedLink';
import { useLocaleMessages } from './LocaleProvider';

const PRIVACY_URL = 'https://sisepuede1.myshopify.com/policies/privacy-policy';
const INSTAGRAM_URL = 'https://www.instagram.com/sisepuede1.0/';

export function FoundersPageFooter() {
  const { messages: m } = useLocaleMessages();
  const fp = m.foundersPage.footer;

  return (
    <footer className="w-full py-8 px-5 sm:px-6 text-center border-t" style={{ borderColor: 'var(--border)' }}>
      <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
        {fp.copyright}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
        <a
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
          style={{ color: 'var(--muted)' }}
        >
          {fp.privacy}
        </a>
        <TrackedLink
          href={INSTAGRAM_URL}
          eventName="cta_instagram_clicked"
          eventProperties={{ cta_location: 'founders_footer' }}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
          style={{ color: 'var(--muted)' }}
        >
          {fp.instagram}
        </TrackedLink>
      </div>
    </footer>
  );
}
