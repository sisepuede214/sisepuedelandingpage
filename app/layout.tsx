import type { Metadata } from 'next';
import './globals.css';
import { PostHogProvider } from './components/PostHogProvider';

export const metadata: Metadata = {
  title: 'Si Se Puede — Hydration for the Culture',
  description: 'First drop coming soon. La Bandera, May 3rd. Join the list.',
  openGraph: {
    title: 'Si Se Puede — Hydration for the Culture',
    description: 'First drop coming soon. La Bandera, May 3rd. Join the list.',
    type: 'website',
    siteName: 'Si Se Puede',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Si Se Puede — Hydration for the Culture',
    description: 'First drop coming soon. La Bandera, May 3rd.',
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
