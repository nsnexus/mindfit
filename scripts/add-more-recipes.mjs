// One-time addition of 87 new recipes (Fase 3 de conteúdo) to Firestore's
// `recipes` collection, taking the catalog from 33 to 120 total recipes.
//
// Usage: node scripts/add-more-recipes.mjs
// Requires ./service-account.json (Firebase Admin SDK service account key).
import { readFileSync, existsSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { NEW_RECIPES } from './data/new-recipes-87.mjs';

const SERVICE_ACCOUNT_PATH = new URL('../service-account.json', import.meta.url);

if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('service-account.json not found at repo root. This script needs a Firebase Admin SDK key to run.');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function main() {
  console.log(`Preparing to write ${NEW_RECIPES.length} new recipes to Firestore...`);

  const CHUNK = 20;
  let written = 0;
  for (let i = 0; i < NEW_RECIPES.length; i += CHUNK) {
    const chunk = NEW_RECIPES.slice(i, i + CHUNK);
    const batch = db.batch();
    for (const recipe of chunk) {
      const ref = db.collection('recipes').doc(recipe.id);
      batch.set(ref, { ...recipe, updatedAt: FieldValue.serverTimestamp() });
    }
    await batch.commit();
    written += chunk.length;
    console.log(`  ${written}/${NEW_RECIPES.length} written`);
  }

  console.log('\nDone. Verifying total count in Firestore...');
  const snap = await db.collection('recipes').get();
  console.log(`Total recipes now in Firestore: ${snap.size}`);
}

main().catch((err) => {
  console.error('Fatal error while writing recipes:', err);
  process.exit(1);
});
