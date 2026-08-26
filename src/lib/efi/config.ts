// ============================================
// Configuração do Gateway de Pagamento — Éfi Bank
// ============================================

export const EFI_CONFIG = {
  clientId: process.env.EFI_CLIENT_ID || '',
  clientSecret: process.env.EFI_CLIENT_SECRET || '',
  certificatePath: process.env.EFI_CERTIFICATE_PATH || './certs/efi-cert.p12',
  sandbox: process.env.EFI_SANDBOX === 'true' || true,
  pixKey: process.env.EFI_PIX_KEY || 'sua_chave_pix@email.com',
  apiUrl: process.env.EFI_SANDBOX === 'true'
    ? 'https://pix-h.gerencianet.com.br'
    : 'https://pix.gerencianet.com.br',
};
