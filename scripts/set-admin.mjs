// Script de uso único: garante que nsnexustech@gmail.com seja admin.
// Roda com: node scripts/set-admin.mjs
import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(readFileSync('./service-account.json', 'utf-8'));
initializeApp({ credential: cert(serviceAccount) });

const auth = getAuth();
const db = getFirestore();

const ADMIN_EMAIL = 'nsnexustech@gmail.com';

async function main() {
  let userRecord;
  let resetLink = null;

  try {
    userRecord = await auth.getUserByEmail(ADMIN_EMAIL);
    console.log(`Conta já existe: uid=${userRecord.uid}`);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      const tempPassword = `Nx${Math.random().toString(36).slice(2, 10)}!${Math.floor(Math.random() * 100)}`;
      userRecord = await auth.createUser({
        email: ADMIN_EMAIL,
        password: tempPassword,
        emailVerified: true,
        displayName: 'Admin',
      });
      console.log(`Conta criada agora: uid=${userRecord.uid}`);
      resetLink = await auth.generatePasswordResetLink(ADMIN_EMAIL);
    } else {
      throw err;
    }
  }

  const userRef = db.collection('users').doc(userRecord.uid);
  const snap = await userRef.get();

  await userRef.set(
    {
      uid: userRecord.uid,
      email: ADMIN_EMAIL,
      displayName: userRecord.displayName || snap.data()?.displayName || 'Admin',
      role: 'admin',
      isPremium: true,
      onboardingCompleted: snap.data()?.onboardingCompleted ?? true,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  console.log(`✅ ${ADMIN_EMAIL} (uid=${userRecord.uid}) agora é admin.`);
  if (resetLink) {
    console.log('\n🔗 Link pra definir a senha (válido por tempo limitado):');
    console.log(resetLink);
  }
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
