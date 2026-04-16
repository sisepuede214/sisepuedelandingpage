import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LocaleProvider } from '../components/LocaleProvider';
import { getMessages } from '@/lib/i18n/messages';
import { isValidLocale, type AppLocale } from '@/lib/i18n/locale';

const SITE_METADATA: Record<
  AppLocale,
  { title: string; description: string; ogDescription: string }
> = {
  en: {
    title: 'Si Se Puede — Hydration for the cultura',
    description:
      'For people at the event. SISE electrolyte drink — pre-orders open May 5th. Get early access.',
    ogDescription:
      'For people at the event. SISE electrolyte drink — pre-orders open May 5th. Get early access.',
  },
  es: {
    title: 'Si Se Puede — Hidratación para la cultura',
    description:
      'Para la gente del evento. Bebida con electrolitos SISE — preventas el 5 de mayo. Acceso anticipado.',
    ogDescription:
      'Para la gente del evento. Bebida con electrolitos SISE — preventas el 5 de mayo. Acceso anticipado.',
  },
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isValidLocale(raw) ? raw : 'en';
  const m = SITE_METADATA[locale];

  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.ogDescription,
      type: 'website',
      siteName: 'Si Se Puede',
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
    },
  };
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale: raw } = await params;
  if (!isValidLocale(raw)) {
    notFound();
  }
  const locale = raw;
  const messages = getMessages(locale);

  return (
    <LocaleProvider locale={locale} messages={messages}>
      {children}
    </LocaleProvider>
  );
}
