// ============================================
// Wellness Chat Types (assistente de apoio emocional)
// ============================================

export interface WellnessMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  flagged?: boolean; // true quando a rede de segurança de crise foi acionada
  createdAt: string; // ISO
}
