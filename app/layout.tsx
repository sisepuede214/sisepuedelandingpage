import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import { PostHogProvider } from './components/PostHogProvider';
import { LOCALE_COOKIE } from '@/lib/i18n/locale';

export const metadata: Metadata = {
  title: 'Si Se Puede',
  description: 'SISE electrolyte drink — pre-orders and early access.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE)?.value;
  const lang = raw === 'es' ? 'es' : 'en';

  return (
    <html lang={lang} className="h-full">
      <body className="min-h-full flex flex-col">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
