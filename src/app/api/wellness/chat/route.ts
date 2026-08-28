// ============================================
// API Route: Chat do Assistente de Bem-Estar Emocional
// ============================================
import { NextResponse } from 'next/server';
import { verifyFirebaseIdToken } from '@/lib/verifyFirebaseToken';
import { getWellnessReply, type ChatTurn } from '@/lib/wellnessAi';

// Limite de turnos enviados ao modelo por requisição (controla custo/latência)
const MAX_HISTORY_TURNS = 20;

export async function POST(req: Request) {
  try {
    // Só usuários autenticados podem consumir a API (protege o custo da chave)
    const uid = await verifyFirebaseIdToken(req.headers.get('authorization'));
    if (!uid) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }

    const body = await req.json();
    const history = Array.isArray(body?.history) ? (body.history as ChatTurn[]) : [];

    if (history.length === 0 || history[history.length - 1]?.role !== 'user') {
      return NextResponse.json({ error: 'Mensagem inválida.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Assistente de bem-estar ainda não configurado. Tente novamente mais tarde.' },
        { status: 503 }
      );
    }

    const trimmedHistory = history.slice(-MAX_HISTORY_TURNS);
    const { text, flagged } = await getWellnessReply(trimmedHistory, apiKey);

    return NextResponse.json({ text, flagged });
  } catch (err) {
    console.error('Erro no chat de bem-estar:', err);
    return NextResponse.json({ error: 'Não foi possível gerar uma resposta agora.' }, { status: 500 });
  }
}
