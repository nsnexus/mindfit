// Script de uso único: marca nsnexustech@gmail.com com o custom claim
// admin:true (usado pelas regras de seguranca do Storage). Roda com:
// node scripts/set-admin-claim.mjs
import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = JSON.parse(readFileSync('./service-account.json', 'utf-8'));
initializeApp({ credential: cert(serviceAccount) });

const auth = getAuth();
const ADMIN_EMAIL = 'nsnexustech@gmail.com';

async function main() {
  const user = await auth.getUserByEmail(ADMIN_EMAIL);
  await auth.setCustomUserClaims(user.uid, { admin: true });
  console.log(`✅ Custom claim admin:true setado para ${ADMIN_EMAIL} (uid=${user.uid})`);
  console.log('⚠️  Precisa deslogar e logar de novo (ou dar refresh forçado) pra o token pegar o claim novo.');
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
