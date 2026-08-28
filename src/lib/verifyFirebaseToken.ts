// ============================================
// Verificação server-side de ID Token do Firebase Auth (sem Admin SDK,
// compatível com o runtime edge do Cloudflare Workers via `jose`)
// ============================================
import { jwtVerify, createRemoteJWKSet } from 'jose';

const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(JWKS_URL));
  }
  return jwks;
}

/**
 * Verifica um ID Token do Firebase Auth vindo do header Authorization: Bearer <token>.
 * Retorna o uid do usuário se válido, ou null se inválido/expirado/ausente.
 */
export async function verifyFirebaseIdToken(authHeader: string | null): Promise<string | null> {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return null;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}
