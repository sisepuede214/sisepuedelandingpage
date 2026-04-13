import Image from 'next/image';
import { SignupForm } from './components/SignupForm';
import { CountdownTimer } from './components/CountdownTimer';

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--background)' }}>

      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
        <Image
          src="/sise-logo.png"
          alt="SISE"
          width={80}
          height={32}
          style={{ filter: 'invert(1) brightness(2)' }}
          priority
        />
        <a
          href="https://www.instagram.com/sisepuede1.0/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Si Se Puede on Instagram"
          className="transition-opacity hover:opacity-70"
          style={{ color: 'var(--muted)' }}
        >
          <InstagramIcon />
        </a>
      </nav>

      <main className="flex-1 flex flex-col items-center px-6 pt-10 pb-0 w-full">

        {/* Hero */}
        <div className="w-full max-w-lg flex flex-col items-center text-center gap-8">


          <p
            className="text-sm sm:text-base leading-snug max-w-sm"
            style={{ color: 'var(--foreground)' }}
          >
            If you&apos;re seeing this, you&apos;re early.
          </p>

          <p
            className="text-xs font-semibold uppercase tracking-widest max-w-xs leading-relaxed"
            style={{ color: 'var(--accent)' }}
          >
            This is bigger than a drink. Pre-orders coming soon.
          </p>

          <p
            className="text-base sm:text-lg leading-relaxed max-w-sm"
            style={{ color: 'var(--muted)' }}
          >
            Built for those who carry the flag.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <h1
              className="text-6xl sm:text-7xl md:text-8xl leading-none tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              Hydration for the{' '}
              <span style={{ color: 'var(--highlight)' }}>cultura.</span>
            </h1>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--muted)' }}
            >
              SISE · Electrolyte Drink
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--foreground)' }}>
              Pre-orders open July 4.
            </p>
            <CountdownTimer />
          </div>
        </div>

        {/* Get early access */}
        <div
          id="signup"
          className="w-full max-w-lg flex flex-col items-center text-center gap-5 mt-16 scroll-mt-24"
        >
          <h2
            className="text-4xl sm:text-5xl uppercase tracking-wide leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
          >
            Get early access
          </h2>
          <div className="flex flex-col gap-1">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
              Enter your info. We&apos;ll text you first.
            </p>
            <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
              The people here get it first.
            </p>
          </div>
          <SignupForm />
        </div>

        {/* La Bandera / community */}
        <section
          className="w-full max-w-3xl mt-24 flex flex-col items-center gap-4 px-0"
          style={{ borderTop: '1px solid var(--border)', paddingTop: '4rem' }}
        >
          <figure className="w-full flex flex-col items-center gap-4">
            <div
              className="relative w-full overflow-hidden rounded-lg"
              style={{ aspectRatio: '16 / 10', background: 'var(--surface)' }}
            >
              <Image
                src="/la-bandera-community.jpg"
                alt="La Bandera — community"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 48rem"
              />
            </div>
            <figcaption className="text-center max-w-md px-2">
              <p className="text-sm italic leading-relaxed" style={{ color: 'var(--foreground)' }}>
                &ldquo;This is bigger than a drink.&rdquo;
              </p>
            </figcaption>
          </figure>
        </section>

        {/* Manifesto */}
        <section
          className="w-full max-w-xl mt-24 flex flex-col items-center text-center gap-0 pb-8"
          style={{ borderTop: '1px solid var(--border)', paddingTop: '4rem' }}
        >
          <p
            className="text-base sm:text-lg leading-relaxed mb-12 max-w-sm"
            style={{ color: 'var(--muted)' }}
          >
            What you felt today, that&apos;s where this comes from.
          </p>

          <div className="flex flex-col gap-1 mb-12 w-full">
            <p
              className="text-5xl sm:text-6xl uppercase tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              We&apos;re built to go
            </p>
            <p
              className="text-5xl sm:text-6xl uppercase tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--highlight)' }}
            >
              the distance.
            </p>
          </div>

          <p
            className="text-2xl sm:text-3xl uppercase tracking-wide mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
          >
            To face hard things.
          </p>
          <p
            className="text-2xl sm:text-3xl uppercase tracking-wide mb-16"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
          >
            To keep showing up.
          </p>

          <p
            className="text-base sm:text-lg leading-relaxed mb-16 max-w-sm"
            style={{ color: 'var(--muted)' }}
          >
            We made this to represent us and to fuel the journey.
          </p>

          <div className="flex flex-col gap-2 mb-8">
            {['For you.', 'For us.', 'For the cultura.'].map((line) => (
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

        {/* Product mockup */}
        <section
          className="w-full max-w-3xl mt-8 flex flex-col items-center gap-4 pb-8"
          style={{ borderTop: '1px solid var(--border)', paddingTop: '4rem' }}
        >
          <figure className="w-full flex flex-col items-center gap-4">
            <div
              className="relative w-full max-w-md mx-auto overflow-hidden rounded-lg aspect-4/5"
              style={{ background: 'var(--surface)' }}
            >
              <Image
                src="/sise-product-mockup.jpg"
                alt="SISE product"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 48rem"
              />
            </div>
            <figcaption>
            </figcaption>
          </figure>
        </section>

        {/* Closing CTA */}
        <section
          className="w-full max-w-lg mt-16 mb-8 flex flex-col items-center text-center gap-8 py-16 px-6"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <div className="flex flex-col gap-4">
            <p
              className="text-4xl sm:text-5xl uppercase tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              You were here first.
            </p>
            <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'var(--muted)' }}>
              Don&apos;t miss what comes next.
            </p>
          </div>
          <a
            href="#signup"
            className="btn-accent inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold uppercase tracking-wide"
          >
            Get early access
            <span>↑</span>
          </a>
        </section>

        <section
          className="w-full py-8 px-6"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div className="max-w-lg mx-auto flex items-center justify-center">
            <a
              href="https://www.instagram.com/sisepuede1.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--muted)' }}
            >
              <InstagramIcon />
              <span>Follow the journey</span>
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

      <footer
        className="w-full py-5 px-6 text-center"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          © 2026 Si Se Puede. By subscribing you agree to receive marketing communications.
          You can unsubscribe at any time.
        </p>
      </footer>
    </div>
  );
}
