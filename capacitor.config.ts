import type { CapacitorConfig } from '@capacitor/cli';

// ============================================
// Capacitor — empacota o Mindfit web (Next.js na Cloudflare) num app
// Android nativo. Carrega a URL de produção direto (server.url), então
// o app nativo é sempre a versão mais recente publicada — sem precisar
// gerar build/republicar o app pra cada mudança do site.
// ============================================
const config: CapacitorConfig = {
  appId: 'com.nsnexus.mindfit',
  appName: 'Mindfit',
  webDir: 'public',
  server: {
    url: 'https://mindfit.nsnexus.com.br',
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    useLegacyBridge: true,
  },
};

export default config;
