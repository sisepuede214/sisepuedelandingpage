import type { Metadata } from 'next';
import { getMessages } from '@/lib/i18n/messages';
import { isValidLocale, type AppLocale } from '@/lib/i18n/locale';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const FOUNDERS_OG_IMAGE = '/Founders240.png';
const FOUNDERS_OG_WIDTH = 5056;
const FOUNDERS_OG_HEIGHT = 2528;

function getMetadataBase(): URL {
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) return new URL(site.startsWith('http') ? site : `https://${site}`);
  return new URL('http://localhost:3000');
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: AppLocale = isValidLocale(raw) ? raw : 'en';
  const meta = getMessages(locale).foundersPage.meta;

  return {
    metadataBase: getMetadataBase(),
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      type: 'website',
      siteName: 'Si Se Puede',
      images: [
        {
          url: FOUNDERS_OG_IMAGE,
          width: FOUNDERS_OG_WIDTH,
          height: FOUNDERS_OG_HEIGHT,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.ogDescription,
      images: [FOUNDERS_OG_IMAGE],
    },
  };
}

export default function FoundersLayout({ children }: LayoutProps) {
  return children;
}
