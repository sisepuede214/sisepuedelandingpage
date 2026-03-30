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

      {/* Nav */}
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

      <main className="flex-1 flex flex-col items-center px-6 pt-12 pb-0">

        {/* ── Hero ── */}
        <div className="w-full max-w-lg flex flex-col items-center text-center gap-10">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
            style={{
              background: 'rgba(232,112,10,0.12)',
              color: 'var(--accent)',
              border: '1px solid rgba(232,112,10,0.25)',
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: 'var(--accent)' }}
            />
            La Bandera · May 3rd
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-4">
            <h1
              className="text-7xl sm:text-8xl md:text-9xl leading-none tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              Hydration
              <br />
              <span style={{ color: 'var(--accent)' }}>for the</span>
              <br />
              culture.
            </h1>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--muted)' }}
            >
              SISE · Sports Drink Beverage · Coming Soon
            </p>
          </div>

          {/* Countdown */}
          <CountdownTimer />

          {/* Form */}
          <div id="signup" className="w-full flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                Join the drop
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)', opacity: 0.6 }}>
                Add your phone — we'll text you the location on May 3rd.
              </p>
            </div>
            <SignupForm />
          </div>
        </div>

        {/* ── Manifesto ── */}
        <section
          className="w-full max-w-xl mt-28 flex flex-col items-center text-center gap-0 pb-24"
          style={{ borderTop: '1px solid var(--border)', paddingTop: '5rem' }}
        >
          {/* Intro */}
          <p
            className="text-sm leading-relaxed mb-8 max-w-xs"
            style={{ color: 'var(--muted)' }}
          >
            If our journey taught us anything,
          </p>

          <p
            className="text-base sm:text-lg leading-relaxed mb-16 max-w-sm"
            style={{ color: 'var(--foreground)' }}
          >
            it&apos;s that people like us carry more strength than we realize.
          </p>

          {/* Big statements */}
          <div className="flex flex-col gap-1 mb-16 w-full">
            <p
              className="text-5xl sm:text-6xl uppercase tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              We&apos;re built to go
            </p>
            <p
              className="text-5xl sm:text-6xl uppercase tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
            >
              the distance.
            </p>
          </div>

          <div className="flex flex-col gap-1 mb-16 w-full">
            <p
              className="text-5xl sm:text-6xl uppercase tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              We can face
            </p>
            <p
              className="text-5xl sm:text-6xl uppercase tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              hard things.
            </p>
          </div>

          <div className="flex flex-col gap-1 mb-16 w-full">
            <p
              className="text-5xl sm:text-6xl uppercase tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              Go after what feels
            </p>
            <p
              className="text-5xl sm:text-6xl uppercase tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
            >
              impossible.
            </p>
          </div>

          {/* Body */}
          <p
            className="text-base sm:text-lg leading-relaxed mb-4 max-w-sm"
            style={{ color: 'var(--muted)' }}
          >
            Continue to show up and do the work.
          </p>
          <p
            className="text-base sm:text-lg leading-relaxed mb-20 max-w-sm"
            style={{ color: 'var(--muted)' }}
          >
            We made this to represent us — and to fuel us through the journey.
          </p>

          {/* For you, For us, For the culture */}
          <div className="flex flex-col gap-2 mb-16">
            {['For you,', 'For us,', 'For the culture.'].map((line) => (
              <p
                key={line}
                className="text-3xl sm:text-4xl uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
              >
                {line}
              </p>
            ))}
          </div>

          {/* Product label */}
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ color: 'var(--muted)' }}
          >
            SISE · A Sports Drink Beverage · Coming Soon
          </p>

          {/* SI SE PUEDE closer */}
          <p
            className="text-6xl sm:text-7xl md:text-8xl uppercase tracking-wide leading-none"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
          >
            Si Se Puede
          </p>

        </section>

        {/* ── Product Tease ── */}
        <section
          className="w-full py-24 px-6"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div className="max-w-lg mx-auto flex flex-col items-center text-center gap-14">

            {/* Obscured can */}
            <div className="relative flex items-center justify-center" style={{ width: 160, height: 260 }}>

              {/* Outer glow bloom */}
              <div
                className="absolute"
                style={{
                  width: 160,
                  height: 260,
                  borderRadius: '60px',
                  background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.07) 0%, transparent 70%)',
                  filter: 'blur(18px)',
                }}
              />

              {/* Mid glow ring */}
              <div
                className="absolute"
                style={{
                  width: 120,
                  height: 220,
                  borderRadius: '48px',
                  boxShadow: '0 0 40px 8px rgba(255,255,255,0.06), 0 0 80px 20px rgba(232,112,10,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'linear-gradient(175deg, rgba(255,255,255,0.06) 0%, rgba(232,112,10,0.04) 40%, transparent 100%)',
                }}
              />

              {/* Can body */}
              <div
                className="absolute"
                style={{
                  width: 90,
                  height: 190,
                  borderRadius: '32px',
                  background: 'linear-gradient(170deg, rgba(255,255,255,0.12) 0%, rgba(200,190,180,0.06) 35%, rgba(10,9,9,0.6) 100%)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  boxShadow: '0 0 24px 4px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(4px)',
                }}
              />

              {/* Primary glare streak — left */}
              <div
                className="absolute"
                style={{
                  top: '10%',
                  left: 'calc(50% - 30px)',
                  width: 14,
                  height: '55%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)',
                  borderRadius: '50%',
                  filter: 'blur(3px)',
                }}
              />

              {/* Secondary glare streak — right edge */}
              <div
                className="absolute"
                style={{
                  top: '18%',
                  left: 'calc(50% + 16px)',
                  width: 5,
                  height: '30%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                  borderRadius: '50%',
                  filter: 'blur(2px)',
                }}
              />

              {/* Label blur zone */}
              <div
                className="absolute flex items-center justify-center"
                style={{
                  top: '30%',
                  width: 70,
                  height: 80,
                  borderRadius: '8px',
                  background: 'rgba(10,9,9,0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.55rem',
                    letterSpacing: '0.3em',
                    color: 'rgba(255,255,255,0.25)',
                  }}
                >
                  MAY 3
                </span>
              </div>

              {/* Bottom rim highlight */}
              <div
                className="absolute"
                style={{
                  bottom: '13%',
                  width: 70,
                  height: 6,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  filter: 'blur(3px)',
                }}
              />
            </div>

            {/* Sensation copy */}
            <div className="flex flex-col gap-5">
              <p
                className="text-4xl sm:text-5xl uppercase leading-tight tracking-wide"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
              >
                Cold.{' '}
                <span style={{ color: 'var(--accent)' }}>Sharp.</span>
                <br />
                Built for the last mile.
              </p>
              <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'var(--muted)' }}>
                What it tastes like stays between us until May 3rd.
                The first sip goes to the people who show up.
              </p>
            </div>

          </div>
        </section>

        {/* ── La Bandera ── */}
        <section
          className="w-full py-20 px-6"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <div className="max-w-lg mx-auto flex flex-col items-center text-center gap-10">

            {/* Scarcity statement */}
            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                La Bandera · May 3rd
              </p>
              <h2
                className="text-4xl sm:text-5xl uppercase leading-tight tracking-wide"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
              >
                First time we&apos;re
                <br />
                letting it out.
                <br />
                <span style={{ color: 'var(--accent)' }}>La Bandera only.</span>
              </h2>
              <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'var(--muted)' }}>
                We&apos;re bringing the first batch. Limited samples.
                No second run. You either catch it or you don&apos;t.
              </p>
            </div>

            {/* Divider */}
            <div className="w-8 h-px" style={{ background: 'var(--border)' }} />

            {/* Be there first */}
            <div className="flex flex-col gap-5">
              <h3
                className="text-2xl sm:text-3xl uppercase leading-tight tracking-wide"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
              >
                The first people to try SISE
                <br />
                will be at La Bandera.
                <br />
                <span style={{ color: 'var(--muted)' }}>The rest will hear about it after.</span>
              </h3>
              <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                The list gets location + drop details first.
              </p>
              <a
                href="#signup"
                className="btn-accent inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold uppercase tracking-wide mx-auto"
              >
                Get on the list
                <span>↑</span>
              </a>
            </div>

          </div>
        </section>

        {/* ── Social strip ── */}
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

      {/* Footer */}
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
