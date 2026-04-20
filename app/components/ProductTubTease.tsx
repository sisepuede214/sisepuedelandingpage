import Image from 'next/image';

type ProductTubTeaseProps = {
  imageAlt: string;
  variant: 'hero' | 'section';
};

export function ProductTubTease({ imageAlt, variant }: ProductTubTeaseProps) {
  const glitchClassName =
    variant === 'hero'
      ? 'product-tease-glitch relative w-full max-w-none sm:max-w-[272px] mx-auto overflow-hidden rounded-none sm:rounded-lg aspect-4/5'
      : 'product-tease-glitch relative w-full max-w-md mx-auto overflow-hidden rounded-lg aspect-4/5';

  const sizes =
    variant === 'hero' ? '(max-width: 640px) 100vw, 272px' : '(max-width: 768px) 100vw, 48rem';

  const figure = (
    <figure className="w-full flex flex-col items-center gap-4">
      <div className={glitchClassName}>
        <Image
          src="/MOCKUP.png"
          alt={imageAlt}
          fill
          className="product-tease-base object-contain"
          sizes={sizes}
          priority={variant === 'hero'}
        />
        <Image
          src="/MOCKUP.png"
          alt=""
          aria-hidden="true"
          fill
          className="product-tease-layer product-tease-layer-green object-contain pointer-events-none select-none"
          sizes={sizes}
        />
        <Image
          src="/MOCKUP.png"
          alt=""
          aria-hidden="true"
          fill
          className="product-tease-layer product-tease-layer-red object-contain pointer-events-none select-none"
          sizes={sizes}
        />
      </div>
      <figcaption />
    </figure>
  );

  if (variant === 'hero') {
    return (
      <div className="w-[calc(100%+3rem)] -mx-6 sm:mx-0 sm:w-full flex flex-col items-center">
        <div
          className="w-full rounded-none px-0 py-5 flex flex-col items-center sm:max-w-[300px] sm:rounded-xl sm:px-4"
          style={{
            border: '1px solid var(--border)',
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.72)), url('/SISELOGOblack.png')",
            backgroundRepeat: 'repeat, repeat',
            backgroundSize: 'auto, 190px auto',
            backgroundPosition: '0 0, 0 20px',
            backgroundBlendMode: 'normal, multiply',
          }}
        >
          {figure}
        </div>
      </div>
    );
  }

  return (
    <section
      className="w-full max-w-3xl mt-24 flex flex-col items-center gap-4 pb-8"
      style={{
        borderTop: '1px solid var(--border)',
        paddingTop: '4rem',
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.72)), url('/SISELOGOblack.png')",
        backgroundRepeat: 'repeat, repeat',
        backgroundSize: 'auto, 190px auto',
        backgroundPosition: '0 0, 0 20px',
        backgroundBlendMode: 'normal, multiply',
      }}
    >
      {figure}
    </section>
  );
}
