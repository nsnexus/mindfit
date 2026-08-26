import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import { APP_CONFIG } from '@/constants/config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mindfit.pages.dev'),
  title: {
    default: `${APP_CONFIG.name} — Emagrecimento Saudável em 21 Dias`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: [
    'emagrecimento saudável',
    'perder peso',
    'dieta 21 dias',
    'plano alimentar',
    'treino em casa',
    'reeducação alimentar',
    'método 21 dias',
  ],
  authors: [{ name: APP_CONFIG.name }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
    shortcut: '/icons/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: APP_CONFIG.name,
    title: `${APP_CONFIG.name} — Transforme seus hábitos. Transforme seu corpo.`,
    description: APP_CONFIG.description,
    images: ['/icons/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0e9f6e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
