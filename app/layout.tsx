import type { Metadata } from 'next';
import './globals.css';
import { PostHogProvider } from './components/PostHogProvider';

export const metadata: Metadata = {
  title: 'Si Se Puede — Hydration for the cultura',
  description:
    'For people at the event. SISE electrolyte drink — pre-orders open July 4th. Get early access.',
  openGraph: {
    title: 'Si Se Puede — Hydration for the cultura',
    description:
      'For people at the event. SISE electrolyte drink — pre-orders open July 4th. Get early access.',
    type: 'website',
    siteName: 'Si Se Puede',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Si Se Puede — Hydration for the cultura',
    description:
      'SISE electrolyte drink — pre-orders open July 4th. Get early access.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
