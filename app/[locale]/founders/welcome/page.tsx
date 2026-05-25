import Image from 'next/image';
import { FounderBenefitsGrid } from '@/app/components/FounderBenefitsGrid';
import { FoundersPageFooter } from '@/app/components/FoundersPageFooter';
import { FoundersPageNav } from '@/app/components/FoundersPageNav';
import { FoundersPageTouchpoint } from '@/app/components/FoundersPageTouchpoint';
import { TrackedLink } from '@/app/components/TrackedLink';
import { FOUNDERS_GROUP_CHAT_URL } from '@/lib/founders';
import { getMessages } from '@/lib/i18n/messages';

const INSTAGRAM_URL = 'https://www.instagram.com/sisepuede1.0/';

const CTA_CLASS =
  'btn-founder inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-medium w-full sm:w-auto sm:min-w-[280px]';

const DISPLAY_HEADING =
  'text-4xl sm:text-5xl uppercase tracking-wide leading-tight' as const;
const DISPLAY_HEADING_STYLE = {
  fontFamily: 'var(--font-display)',
  color: 'var(--foreground)',
} as const;

type PageProps = { params: Promise<{ locale: string }> };

export default async function FoundersWelcomePage({ params }: PageProps) {
  const { locale: raw } = await params;
  const m = getMessages(raw);
  const wp = m.foundersWelcomePage;
  const benefitsItems = m.foundersPage.benefits.items;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--background)' }}>
      <FoundersPageNav />
      <FoundersPageTouchpoint />

      <main className="flex-1 w-full">
        <section className="flex flex-col items-center text-center gap-6 sm:gap-8 py-12 sm:py-14 px-5 sm:px-6 max-w-3xl mx-auto w-full">
          <Image
            src="/Founders240.png"
            alt={wp.hero.eyebrow}
            width={960}
            height={480}
            sizes="(max-width: 768px) 100vw, 48rem"
            className="w-full max-w-3xl h-auto mx-auto"
            priority
          />

          <h1 className={`${DISPLAY_HEADING} max-w-2xl`} style={DISPLAY_HEADING_STYLE}>
            {wp.hero.headline}
          </h1>

          <p
            className="text-[15px] leading-[1.8] max-w-xl"
            style={{ color: 'var(--muted)' }}
          >
            {wp.hero.subhead}
          </p>

          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <TrackedLink
              href={FOUNDERS_GROUP_CHAT_URL}
              eventName="cta_founders_group_chat_clicked"
              eventProperties={{ cta_location: 'founders_welcome_hero' }}
              target="_blank"
              rel="noopener noreferrer"
              className={CTA_CLASS}
            >
              {wp.hero.groupChatCta}
              <span aria-hidden="true">→</span>
            </TrackedLink>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {wp.hero.groupChatNote}
            </p>
          </div>
        </section>

        <section
          className="border-t py-12 px-5 sm:px-6 max-w-3xl mx-auto w-full"
          style={{ borderColor: 'var(--border)' }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ color: 'var(--muted)' }}
          >
            {wp.intro.label}
          </p>
          <div
            className="flex flex-col gap-5 text-[15px] leading-[1.8]"
            style={{ color: 'var(--foreground)' }}
          >
            <p>{wp.intro.body1}</p>
            <p>{wp.intro.body2}</p>
          </div>
        </section>

        <FounderBenefitsGrid label={wp.benefits.label} items={benefitsItems} />

        <section
          className="border-t py-12 px-5 sm:px-6 max-w-3xl mx-auto w-full text-center flex flex-col items-center gap-5"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {wp.cta.label}
          </p>
          <TrackedLink
            href={INSTAGRAM_URL}
            eventName="cta_instagram_clicked"
            eventProperties={{ cta_location: 'founders_welcome' }}
            target="_blank"
            rel="noopener noreferrer"
            className={CTA_CLASS}
          >
            {wp.cta.button}
            <span aria-hidden="true">→</span>
          </TrackedLink>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {wp.cta.instagramHandle}
          </p>
        </section>
      </main>

      <FoundersPageFooter />
    </div>
  );
}
