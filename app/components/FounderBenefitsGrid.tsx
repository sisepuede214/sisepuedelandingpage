import { FounderBenefitIcon } from '@/app/components/founderBenefitIcons';

const DISPLAY_HEADING_STYLE = {
  fontFamily: 'var(--font-display)',
  color: 'var(--foreground)',
} as const;

const DISPLAY_SUBHEADING =
  'text-2xl sm:text-3xl uppercase tracking-wide leading-tight' as const;

export type FounderBenefitItem = {
  icon: string;
  title: string;
  description: string;
};

type FounderBenefitsGridProps = {
  label: string;
  items: readonly FounderBenefitItem[];
};

export function FounderBenefitsGrid({ label, items }: FounderBenefitsGridProps) {
  return (
    <section
      className="border-t py-12 px-5 sm:px-6 max-w-3xl mx-auto w-full"
      style={{ borderColor: 'var(--border)' }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-8"
        style={{ color: 'var(--muted)' }}
      >
        {label}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
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
  );
}
