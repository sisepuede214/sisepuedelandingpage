import Image from 'next/image';
import { ProductTubTease } from '../components/ProductTubTease';
import { SignupGate } from '../components/SignupGate';
import { CountdownTimer } from '../components/CountdownTimer';
import { LanguageToggle } from '../components/LanguageToggle';
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

export default async function Home({ params }: PageProps) {
  const { locale: raw } = await params;
  const m = getMessages(raw);

  const manifestoAccentLines = [m.manifesto.forYou, m.manifesto.forUs, m.manifesto.forCultura];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--background)' }}>
      <header
        className="w-full border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 md:py-14">
          <Image
            src="/BLACKLOGO.png"
            alt="SISE"
            width={920}
            height={370}
            className="w-full h-auto max-w-none object-contain object-center mx-auto max-h-[min(42vh,320px)] sm:max-h-[280px] md:max-h-[340px] lg:max-h-[380px] opacity-65"
            sizes="100vw"
            priority
          />
        </div>
      </header>

      <nav className="flex items-center justify-end px-6 py-5 max-w-5xl mx-auto w-full gap-4">
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <a
            href="https://www.instagram.com/sisepuede1.0/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={m.nav.instagramAria}
            className="transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted)' }}
          >
            <InstagramIcon />
          </a>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center px-6 pt-10 pb-0 w-full">
        <div className="w-full max-w-lg flex flex-col items-center text-center gap-8">
          <Image
            src="/SISELOGOblack.png"
            alt="SISE logo"
            width={220}
            height={88}
            className="w-44 sm:w-52 h-auto bg-none"
            priority
          />

          <p
            className="text-sm sm:text-base leading-snug max-w-sm"
            style={{ color: 'var(--foreground)' }}
          >
            {m.hero.early}
          </p>


          <div className="flex flex-col gap-3 w-full">
            <h1
              className="text-6xl sm:text-7xl md:text-8xl leading-none tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              {m.hero.headlineBefore}{' '}
              <span style={{ color: 'var(--highlight)' }}>{m.hero.headlineAccent}</span>
            </h1>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--muted)' }}
            >
              {m.hero.subline}
            </p>
          </div>

          <ProductTubTease variant="hero" imageAlt={m.product.imageAlt} />

          <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--foreground)' }}>
              {m.hero.preorderLine}
            </p>
            <CountdownTimer labels={m.countdown} />
          </div>
        </div>

        <div
          id="signup"
          className="w-full max-w-lg flex flex-col items-center text-center gap-5 mt-16 scroll-mt-24"
        >
          <h2
            className="text-4xl sm:text-5xl uppercase tracking-wide leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
          >
            {m.signupSection.title}
          </h2>
          <div className="flex flex-col gap-1">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
              {m.signupSection.subtitle}
            </p>
            <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
              {m.signupSection.subnote}
            </p>
          </div>
          <SignupGate />
        </div>

        {/* <ProductTubTease variant="section" imageAlt={m.product.imageAlt} /> */}

        <section
          className="w-full max-w-3xl mt-24 flex flex-col items-center gap-4 px-0"
          style={{ borderTop: '1px solid var(--border)', paddingTop: '4rem' }}
        >
          <figure className="w-full flex flex-col items-center gap-4">
            <div
              className="relative w-full overflow-hidden sm:aspect-16/10"
              style={{ background: 'var(--surface)' }}
            >
              <video
                src="/C2211_1.mp4"
                aria-label={m.community.imageAlt}
                className="w-full h-auto object-cover sm:absolute sm:inset-0 sm:h-full sm:w-full"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
            </div>
            {/* <figcaption className="text-center max-w-md px-2">
              <p className="text-sm italic leading-relaxed" style={{ color: 'var(--foreground)' }}>
                {m.community.quote}
              </p>
            </figcaption> */}
          </figure>
        </section>

        <section
          className="w-full max-w-xl mt-24 flex flex-col items-center text-center gap-0 pb-8"
          style={{ borderTop: '1px solid var(--border)', paddingTop: '4rem' }}
        >
          {/* <p
            className="text-base sm:text-lg leading-relaxed mb-12 max-w-sm"
            style={{ color: 'var(--muted)' }}
          >
            {m.manifesto.intro}
          </p>

          <div className="flex flex-col gap-1 mb-12 w-full">
            <p
              className="text-5xl sm:text-6xl uppercase tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              {m.manifesto.line1}
            </p>
            <p
              className="text-5xl sm:text-6xl uppercase tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--highlight)' }}
            >
              {m.manifesto.line2}
            </p>
          </div> */}

          {/* <p
            className="text-2xl sm:text-3xl uppercase tracking-wide mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
          >
            {m.manifesto.hard}
          </p>
          <p
            className="text-2xl sm:text-3xl uppercase tracking-wide mb-16"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
          >
            {m.manifesto.showing}
          </p>

          <p
            className="text-base sm:text-lg leading-relaxed mb-16 max-w-sm"
            style={{ color: 'var(--muted)' }}
          >
            {m.manifesto.body}
          </p> */}

          <div className="flex flex-col gap-2 mb-8">
            {manifestoAccentLines.map((line) => (
              <p
                key={line}
                className="text-3xl sm:text-4xl uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
              >
                {line}
              </p>
            ))}
          </div>
        </section>

        <section
          className="w-full max-w-lg mt-16 mb-8 flex flex-col items-center text-center gap-8 py-16 px-6"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <div className="flex flex-col gap-4">
            <p
              className="text-4xl sm:text-5xl uppercase tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              {m.closing.title}
            </p>
            <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'var(--muted)' }}>
              {m.closing.subtitle}
            </p>
          </div>
          <a
            href="#signup"
            className="btn-accent inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold uppercase tracking-wide"
          >
            {m.closing.cta}
            <span>↑</span>
          </a>
        </section>

        <section className="w-full py-8 px-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="max-w-lg mx-auto flex items-center justify-center">
            <a
              href="https://www.instagram.com/sisepuede1.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--muted)' }}
            >
              <InstagramIcon />
              <span>{m.follow.label}</span>
              <span
                className="transition-transform group-hover:translate-x-0.5"
                style={{ color: 'var(--accent)' }}
              >
                →
              </span>
            </a>
          </div>
        </section>
      </main>

      <footer className="w-full py-5 px-6 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          {m.footer.legal}
        </p>
      </footer>
    </div>
  );
}
