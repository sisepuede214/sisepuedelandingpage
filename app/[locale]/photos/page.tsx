import Image from 'next/image';
import { ProductTubTease } from '@/app/components/ProductTubTease';
import { SignupGate } from '@/app/components/SignupGate';
import { LanguageToggle } from '@/app/components/LanguageToggle';
import { TrackedLink } from '@/app/components/TrackedLink';
import { getMessages } from '@/lib/i18n/messages';

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

const SHOP_URL =
  'https://sisepuede1.myshopify.com/products/hydration-drink-lime-flavor-si-se?utm_source=qr&utm_medium=popup&utm_campaign=214runclub';

type PageProps = { params: Promise<{ locale: string }> };

export default async function PhotosPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const m = getMessages(raw);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--background)' }}>
      <nav className="flex items-center justify-center px-6 py-5 pb-1 max-w-5xl mx-auto w-full gap-4">
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <TrackedLink
            href="https://www.instagram.com/sisepuede1.0/"
            eventName="cta_instagram_clicked"
            eventProperties={{ cta_location: 'photos_header_nav' }}
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

      <main className="flex-1 flex flex-col items-center px-6 pt-2 pb-10 w-full">
        <div className="w-full max-w-xl flex flex-col items-center text-center">
          <Image
            src="/SISELOGOblack.png"
            alt="SISE logo"
            width={920}
            height={370}
            className="w-56 sm:w-64 h-auto"
            priority
          />
        </div>

        <TrackedLink
          href={SHOP_URL}
          eventName="cta_shop_clicked"
          eventProperties={{ cta_location: 'photos_tub' }}
          target="_blank"
          rel="noopener noreferrer"
          ariaLabel={m.photosPage.shopCta}
          className="block w-full max-w-4xl"
        >
          <ProductTubTease variant="compact" imageAlt={m.product.imageAlt} />
        </TrackedLink>

        <section className="w-full max-w-4xl mt-8 flex flex-col items-stretch gap-6">
          <div
            className="w-full flex flex-col items-center text-center gap-4 py-8 px-6 rounded-lg"
            style={{ background: 'var(--surface)' }}
          >
            <SignupGate
              source="214runclub"
              signupPhase="event_day"
              intro={m.photosPage.subtitle}
              submitLabel={m.photosPage.cta}
              shop={{
                href: SHOP_URL,
                label: m.photosPage.shopLink,
                cta: m.photosPage.shopCta,
              }}
              gateCopy={{
                title: m.photosPage.gateTitle,
                subnote: m.photosPage.gateSubnote,
              }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
