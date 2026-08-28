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
    // useLegacyBridge desligado: suspeito de estar quebrando o retorno do
    // dialogo de permissao (onRequestPermissionsResult nao resolvia a
    // Promise, ficava travado sem popup nenhum). Era pra outro problema
    // (throttle de HTTP em segundo plano apos 5min) que nem testamos ainda -
    // permissao funcionando vem primeiro.
  },
};

export default config;
