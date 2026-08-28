import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Poppins, Inter } from 'next/font/google';
import { Providers } from './providers';
import { MetaPixelPageView } from '@/components/MetaPixelPageView';
import { SiteVisitTracker } from '@/components/SiteVisitTracker';
import { APP_CONFIG } from '@/constants/config';
import { META_PIXEL_ID } from '@/lib/metaPixel';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mindfit.pages.dev'),
  title: {
    default: `${APP_CONFIG.name} — Emagreça de forma saudável em ciclos de 21 dias`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: 'Plano alimentar, receitas, treinos guiados e acompanhamento para você criar hábitos saudáveis e emagrecer de forma sustentável. Acesso vitalício por um valor único.',
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
    title: `${APP_CONFIG.name} — Sua mente e seu corpo em forma`,
    description: 'Emagreça de forma saudável em ciclos de 21 dias. Acesso vitalício.',
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
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable}`}>
      <body className="antialiased font-[var(--font-body)] bg-white text-[#12352f] selection:bg-[#0e9f6e] selection:text-white">
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        <Providers>
          <MetaPixelPageView />
          <SiteVisitTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
