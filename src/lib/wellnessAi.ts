// ============================================
// Assistente de Bem-Estar Emocional — chamada ao modelo + rede de segurança
// ============================================

export interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

// Termos que indicam possível risco de crise (autolesão, suicídio, violência).
// Checagem independente do modelo — funciona como rede de segurança mesmo se
// a resposta da IA falhar em seguir as instruções do system prompt.
const CRISIS_PATTERNS: RegExp[] = [
  /quero\s+morrer/i,
  /vontade\s+de\s+morrer/i,
  /n[aã]o\s+aguento\s+mais\s+viver/i,
  /me\s+matar/i,
  /tirar\s+a?\s*minha\s+vida/i,
  /acabar\s+com\s+(a\s+)?minha\s+vida/i,
  /suic[ií]dio/i,
  /suicida/i,
  /me\s+cortar/i,
  /automutila/i,
  /n[aã]o\s+quero\s+mais\s+viver/i,
  /sem\s+sa[íi]da/i,
  /melhor\s+(eu\s+)?(estar|sumir)\s+morto/i,
];

export const CRISIS_RESOURCE_MESSAGE =
  '💛 Percebi que você pode estar passando por um momento muito difícil. Eu sou uma IA de apoio e não substituo ajuda profissional — o que você está sentindo importa e merece cuidado especializado agora.\n\n' +
  '**Fale com alguém agora:**\n' +
  '• CVV (Centro de Valorização da Vida): ligue **188** (24h, gratuito) ou acesse cvv.org.br (chat/e-mail)\n' +
  '• Emergência: **192** (SAMU) ou **190** (Polícia)\n' +
  '• Procure um amigo, familiar ou profissional de saúde mental de confiança agora, se puder.\n\n' +
  'Você não precisa passar por isso sozinho(a). Quer me contar um pouco mais sobre como você está se sentindo enquanto isso?';

export function containsCrisisSignal(text: string): boolean {
  return CRISIS_PATTERNS.some((re) => re.test(text));
}

const SYSTEM_PROMPT = `Você é o "Bem-Estar Mindfit", um assistente de apoio emocional dentro de um aplicativo de fitness e saúde chamado Mindfit.

REGRAS INEGOCIÁVEIS:
- Você NÃO é psicólogo(a), psiquiatra, terapeuta ou qualquer profissional de saúde licenciado. Nunca diga que é.
- Você NÃO diagnostica condições de saúde mental, NÃO prescreve medicação e NÃO substitui terapia ou acompanhamento profissional.
- Se o usuário mencionar qualquer sinal de risco (ideação suicida, autolesão, desejo de morrer, violência), SEMPRE acolha com empatia e oriente a buscar ajuda imediata: CVV 188 (cvv.org.br), ou 192/190 em emergência. Nunca tente "resolver" uma crise sozinho pelo chat.
- Não dê conselhos médicos, diagnósticos ou recomendações de medicamentos.

COMO SE COMPORTAR:
- Tom acolhedor, empático, sem julgamento — escuta ativa antes de sugerir qualquer coisa.
- Pode sugerir práticas simples de bem-estar: respiração, journaling, técnicas de grounding, organização de pensamentos, hábitos saudáveis (sono, movimento, conexão social) — sempre como sugestão gentil, nunca como prescrição.
- Respostas curtas e humanas (2-5 frases), como uma conversa real, não um artigo.
- Sempre incentive, quando fizer sentido, buscar apoio profissional (psicólogo, psiquiatra) para acompanhamento contínuo — você é um complemento, não substituto.
- Responda sempre em português do Brasil.`;

interface AnthropicResponse {
  content?: { type: string; text?: string }[];
}

/**
 * Chama a API da Anthropic (Claude) server-side pra gerar a resposta do
 * assistente de bem-estar, com fallback de rede de segurança pra crise.
 */
export async function getWellnessReply(history: ChatTurn[], apiKey: string): Promise<{ text: string; flagged: boolean }> {
  const lastUserMessage = [...history].reverse().find((t) => t.role === 'user')?.text || '';
  const flagged = containsCrisisSignal(lastUserMessage);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: history.map((t) => ({ role: t.role, content: t.text })),
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`Anthropic API error ${res.status}: ${errBody}`);
  }

  const data = (await res.json()) as AnthropicResponse;
  const modelText = data.content?.find((c) => c.type === 'text')?.text?.trim() || '';

  if (flagged) {
    // Rede de segurança: independente do que o modelo respondeu, garante os
    // recursos de crise na resposta.
    return { text: `${CRISIS_RESOURCE_MESSAGE}`, flagged: true };
  }

  return { text: modelText || 'Desculpa, não consegui pensar em uma resposta agora. Pode tentar reformular?', flagged: false };
}
