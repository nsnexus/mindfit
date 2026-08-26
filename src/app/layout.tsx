import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import { APP_CONFIG } from '@/constants/config';
import './globals.css';

export const metadata: Metadata = {
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
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: APP_CONFIG.name,
    title: `${APP_CONFIG.name} — Transforme seus hábitos. Transforme seu corpo.`,
    description: APP_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#059669',
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
