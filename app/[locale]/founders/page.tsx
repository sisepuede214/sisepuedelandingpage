import { FounderChips } from '@/app/components/FounderChips';
import { FounderBenefitIcon } from '@/app/components/founderBenefitIcons';
import { FounderTracker } from '@/app/components/FounderTracker';
import { FoundersHero } from '@/app/components/FoundersHero';
import { FoundersPageFooter } from '@/app/components/FoundersPageFooter';
import { FoundersPageNav } from '@/app/components/FoundersPageNav';
import { TrackedLink } from '@/app/components/TrackedLink';
import {
  FOUNDERS_SHOPIFY_URL,
  getFounderCount,
  getFoundersRemaining,
  isFoundersSoldOut,
} from '@/lib/founders';
import { getMessages } from '@/lib/i18n/messages';

const CTA_CLASS =
  'btn-founder inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-medium w-full sm:w-auto sm:min-w-[280px]';

const DISPLAY_HEADING =
  'text-4xl sm:text-5xl uppercase tracking-wide leading-tight' as const;
const DISPLAY_HEADING_STYLE = {
  fontFamily: 'var(--font-display)',
  color: 'var(--foreground)',
} as const;
const DISPLAY_SUBHEADING =
  'text-2xl sm:text-3xl uppercase tracking-wide leading-tight' as const;

type PageProps = { params: Promise<{ locale: string }> };

/** Refresh founder count from Shopify about once per minute. */
export const revalidate = 60;

function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

export default async function FoundersPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const m = getMessages(raw);
  const fp = m.foundersPage;
  const count = await getFounderCount();
  const remaining = getFoundersRemaining(count);
  const soldOut = isFoundersSoldOut(count);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--background)' }}>
      <FoundersPageNav />

      <main className="flex-1 w-full">
        <FoundersHero>
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--founder-teal)' }}
          >
            {fp.hero.eyebrow}
          </p>

          <h1 className={`${DISPLAY_HEADING} max-w-2xl`} style={DISPLAY_HEADING_STYLE}>
            {fp.hero.headline}
          </h1>

          <FounderTracker count={count} />

          {!soldOut && (
            <>
              <TrackedLink
                href={FOUNDERS_SHOPIFY_URL}
                eventName="cta_founder_claim_clicked"
                eventProperties={{ cta_location: 'hero' }}
                target="_blank"
                rel="noopener noreferrer"
                className={CTA_CLASS}
              >
                {fp.hero.cta}
                <span aria-hidden="true">→</span>
              </TrackedLink>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {fp.hero.ctaNote}
              </p>
            </>
          )}
        </FoundersHero>

        <section
          className="border-t py-12 px-5 sm:px-6 max-w-3xl mx-auto w-full"
          style={{ borderColor: 'var(--border)' }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ color: 'var(--muted)' }}
          >
            {fp.why240.label}
          </p>
          <div className="flex flex-col gap-5 text-[15px] leading-[1.8]" style={{ color: 'var(--foreground)' }}>
            <p>{fp.why240.body1}</p>
            <p>{fp.why240.body2}</p>
            <p>{fp.why240.body3}</p>
            <p>{fp.why240.lessonIntro}</p>
            <blockquote
              className="text-3xl sm:text-4xl uppercase tracking-wide leading-tight pl-4 border-l-4 my-1"
              style={{
                fontFamily: 'var(--font-display)',
                borderColor: 'var(--founder-teal)',
                color: 'var(--foreground)',
              }}
            >
              {fp.why240.quote}
            </blockquote>
            <p>{fp.why240.body4}</p>
            <p>{fp.why240.body5}</p>
          </div>
        </section>

        <section
          className="border-t py-12 px-5 sm:px-6 max-w-3xl mx-auto w-full"
          style={{ borderColor: 'var(--border)' }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-8"
            style={{ color: 'var(--muted)' }}
          >
            {fp.benefits.label}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fp.benefits.items.map((item) => (
              <div
                key={item.icon}
                className="rounded-lg border p-5 flex flex-col gap-3"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <FounderBenefitIcon name={item.icon} />
                <h3 className={DISPLAY_SUBHEADING} style={DISPLAY_HEADING_STYLE}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {!soldOut && (
          <section
            className="border-t py-12 px-5 sm:px-6 max-w-3xl mx-auto w-full"
            style={{ borderColor: 'var(--border)' }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: 'var(--muted)' }}
            >
              {fp.chips.label}
            </p>
            <FounderChips count={count} />
          </section>
        )}

        <section
          className="border-t py-12 px-5 sm:px-6 max-w-3xl mx-auto w-full text-center flex flex-col items-center gap-5"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex flex-col gap-2 w-full max-w-lg">
            <p className={DISPLAY_HEADING} style={DISPLAY_HEADING_STYLE}>
              {fp.bottomCta.headline}
            </p>
            <p className={DISPLAY_HEADING} style={DISPLAY_HEADING_STYLE}>
              {fp.bottomCta.headline2}
            </p>
          </div>
          <div className="text-[15px] leading-[1.8] max-w-lg" style={{ color: 'var(--muted)' }}>
            <p>{fp.bottomCta.body1}</p>
            <p className="mt-2">{fp.bottomCta.body2}</p>
          </div>

          {!soldOut && (
            <>
              <TrackedLink
                href={FOUNDERS_SHOPIFY_URL}
                eventName="cta_founder_claim_clicked"
                eventProperties={{ cta_location: 'bottom' }}
                target="_blank"
                rel="noopener noreferrer"
                className={CTA_CLASS}
              >
                {fp.hero.cta}
                <span aria-hidden="true">→</span>
              </TrackedLink>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {interpolate(fp.bottomCta.remaining, { count: remaining })}
              </p>
            </>
          )}

          <hr className="w-full max-w-xs border-0 border-t mt-2" style={{ borderColor: 'var(--border)' }} />

          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {fp.bottomCta.questionsBefore}{' '}
            <TrackedLink
              href="https://www.instagram.com/sisepuede1.0/"
              eventName="cta_instagram_clicked"
              eventProperties={{ cta_location: 'founders_bottom_dm' }}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
              style={{ color: 'var(--founder-teal-dark)' }}
            >
              {fp.bottomCta.instagramHandle}
            </TrackedLink>
          </p>
        </section>
      </main>

      <FoundersPageFooter />
    </div>
  );
}
