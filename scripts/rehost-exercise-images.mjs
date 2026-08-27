// One-time migration: download every exercise image currently hosted on
// wger.de (referenced by the `imageURL` field of docs in the Firestore
// `exercises` collection — see scripts/sync-exercise-library.mjs) and
// re-host it in this project's own Firebase Storage bucket, then rewrite
// each doc's `imageURL` to point at the new Storage URL.
//
// Resumable: docs whose imageURL already points at our own bucket/domain
// are skipped, so a failed run can just be re-run to pick up stragglers.
// Failures are logged per-item and never touch imageURL (it keeps working,
// pointing at wger.de) so a partial run always leaves Firestore consistent.
//
// Usage: node scripts/rehost-exercise-images.mjs
// Requires ./service-account.json (Firebase Admin SDK service account key).
import { readFileSync, existsSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const SERVICE_ACCOUNT_PATH = new URL('../service-account.json', import.meta.url);

if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('service-account.json not found at repo root. This script needs a Firebase Admin SDK key to run.');
  process.exit(1);
}

const STORAGE_BUCKET = 'mindfit-d14f7.firebasestorage.app';
const OUR_DOMAINS = ['storage.googleapis.com', STORAGE_BUCKET, 'firebasestorage.googleapis.com'];

const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'));
initializeApp({ credential: cert(serviceAccount), storageBucket: STORAGE_BUCKET });
const db = getFirestore();
const bucket = getStorage().bucket();

const CONCURRENCY = 6;
const LOG_EVERY = 20;

function needsMigration(imageURL) {
  if (!imageURL || typeof imageURL !== 'string') return false;
  if (OUR_DOMAINS.some((d) => imageURL.includes(d))) return false;
  return true;
}

function extFromContentTypeOrUrl(contentType, url) {
  const ctMap = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  if (contentType) {
    const base = contentType.split(';')[0].trim().toLowerCase();
    if (ctMap[base]) return ctMap[base];
  }
  const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  if (match) {
    const ext = match[1].toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return ext === 'jpeg' ? 'jpg' : ext;
  }
  return 'jpg';
}

async function migrateOne(doc) {
  const docId = doc.id;
  const data = doc.data();
  const imageURL = data.imageURL;

  const res = await fetch(imageURL);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} fetching ${imageURL}`);
  }
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const ext = extFromContentTypeOrUrl(contentType, imageURL);
  const path = `workouts/exercises/${docId}.${ext}`;
  const file = bucket.file(path);

  await file.save(buffer, {
    metadata: { contentType },
    public: true,
    resumable: false,
  });

  const newURL = `https://storage.googleapis.com/${bucket.name}/${path}`;

  await doc.ref.update({ imageURL: newURL });

  return newURL;
}

// Simple bounded-concurrency pool.
async function runPool(items, worker, concurrency) {
  let idx = 0;
  let completed = 0;
  const results = [];

  async function next() {
    while (idx < items.length) {
      const i = idx++;
      try {
        const value = await worker(items[i], i);
        results[i] = { ok: true, value };
      } catch (err) {
        results[i] = { ok: false, error: err };
      }
      completed++;
      if (completed % LOG_EVERY === 0 || completed === items.length) {
        console.log(`  ${completed}/${items.length} done`);
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => next());
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log('Fetching exercises collection...');
  const snapshot = await db.collection('exercises').get();
  console.log(`Found ${snapshot.size} exercise docs total.`);

  const toMigrate = snapshot.docs.filter((d) => needsMigration(d.data().imageURL));
  const alreadyDone = snapshot.size - toMigrate.length;
  console.log(`${alreadyDone} already migrated (skipping), ${toMigrate.length} need migration.\n`);

  if (toMigrate.length === 0) {
    console.log('Nothing to do. All exercise images are already re-hosted.');
    return;
  }

  const results = await runPool(
    toMigrate,
    async (doc) => migrateOne(doc),
    CONCURRENCY,
  );

  const failures = [];
  let succeeded = 0;
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.ok) {
      succeeded++;
    } else {
      failures.push({ docId: toMigrate[i].id, error: r.error?.message || String(r.error) });
    }
  }

  console.log('\n=== Migration complete ===');
  console.log(`Succeeded: ${succeeded}/${toMigrate.length} (this run)`);
  console.log(`Already migrated before this run: ${alreadyDone}`);
  console.log(`Failed: ${failures.length}`);
  if (failures.length > 0) {
    console.log('\nFailures (imageURL left pointing at wger.de, safe to re-run script to retry):');
    for (const f of failures) {
      console.log(`  - ${f.docId}: ${f.error}`);
    }
  }
}

main().catch((err) => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
