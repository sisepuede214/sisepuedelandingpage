import type { Metadata } from 'next';
import { getMessages } from '@/lib/i18n/messages';
import { isValidLocale, type AppLocale } from '@/lib/i18n/locale';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isValidLocale(raw) ? raw : 'en';
  const meta = getMessages(locale).foundersPage.meta;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      type: 'website',
      siteName: 'Si Se Puede',
      images: [{ url: '/founders-og.jpg', width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.ogDescription,
      images: ['/founders-og.jpg'],
    },
  };
}

export default function FoundersLayout({ children }: LayoutProps) {
  return children;
}
