import Image from 'next/image';
import { EventPhotosTouchpoint } from '@/app/components/EventPhotosTouchpoint';
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
        <div className="w-full max-w-xl flex flex-col items-center text-center gap-5">
          <Image
            src="/SISELOGOblack.png"
            alt="SISE logo"
            width={920}
            height={370}
            className="w-56 sm:w-64 h-auto"
            priority
          />
          <h1
            className="text-4xl sm:text-5xl uppercase tracking-wide leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
          >
            {m.photosPage.title}
          </h1>
          <p className="text-sm sm:text-base leading-relaxed max-w-md" style={{ color: 'var(--muted)' }}>
            {m.photosPage.subtitle}
          </p>
        </div>

        <section className="w-full max-w-4xl mt-10 flex flex-col items-stretch gap-6">
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg" style={{ background: 'var(--surface)' }}>
            <Image
              src="/photoslandingpage/luchador.JPEG"
              alt={m.photosPage.imageAltOne}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>

          <div
            className="w-full flex flex-col items-center text-center gap-4 py-8 px-6 rounded-lg"
            style={{ background: 'var(--surface)' }}
          >
            <p
              className="text-3xl sm:text-4xl uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              {m.photosPage.ctaTitle}
            </p>
            <EventPhotosTouchpoint />
          </div>

          <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg" style={{ background: 'var(--surface)' }}>
            <Image
              src="/photoslandingpage/flag3.JPEG"
              alt={m.photosPage.imageAltTwo}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
