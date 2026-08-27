// One-time sync of the curated, PT-BR translated exercise library into
// Firestore. Reads scripts/wger-raw-export.json (raw wger data, fetched by
// fetch-wger-source.mjs) and scripts/translations-<categoryId>.json (PT-BR
// translations produced by hand) and upserts each exercise as a document in
// the `exercises` collection.
//
// Usage: node scripts/sync-exercise-library.mjs
// Requires ./service-account.json (Firebase Admin SDK service account key).
import { readFileSync, existsSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const SERVICE_ACCOUNT_PATH = new URL('../service-account.json', import.meta.url);

if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('service-account.json not found at repo root. This script needs a Firebase Admin SDK key to run.');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const CATEGORY_TRANSLATIONS = {
  Abs: 'Abdômen & Core',
  Arms: 'Braços (Bíceps & Tríceps)',
  Back: 'Costas & Dorsal',
  Calves: 'Panturrilhas',
  Chest: 'Peitoral',
  Legs: 'Pernas & Glúteos',
  Shoulders: 'Ombros & Deltoides',
  Cardio: 'Cardio',
};

const MUSCLE_TRANSLATIONS = {
  'Biceps brachii': 'Bíceps',
  'Triceps brachii': 'Tríceps',
  'Rectus abdominis': 'Abdômen Reto',
  'Pectoralis major': 'Peitoral Maior',
  'Quadriceps femoris': 'Quadríceps',
  Gastrocnemius: 'Panturrilha',
  'Gluteus maximus': 'Glúteos',
  'Latissimus dorsi': 'Dorsal',
  Deltoideus: 'Deltoides',
  Trapezius: 'Trapézio',
  Hamstrings: 'Posterior de Coxa',
  'Biceps femoris': 'Bíceps Femoral (Posterior de Coxa)',
  'Obliquus externus abdominis': 'Oblíquo Externo',
  'Serratus anterior': 'Serrátil Anterior',
  'Brachialis': 'Braquial',
  'Soleus': 'Sóleo',
  'Erector spinae': 'Eretores da Espinha',
  'Gluteus medius': 'Glúteo Médio',
  'Obliquus internus abdominis': 'Oblíquo Interno',
  'Anterior deltoid': 'Deltoide Anterior',
  'Wrist flexors': 'Flexores do Punho',
  'Wrist extensors': 'Extensores do Punho',
  'Brachioradialis': 'Braquiorradial',
  'Iliopsoas': 'Iliopsoas',
  'Adductor magnus': 'Adutor Magno',
  'Pectineus': 'Pectíneo',
  'Sartorius': 'Sartório',
  'Rhomboid major': 'Romboide Maior',
  'Infraspinatus': 'Infraespinhal',
  'Splenius': 'Esplênio',
  'Levator scapulae': 'Levantador da Escápula',
};

/** Traduz nome de músculo — usa o mapa quando existe, senão devolve o original (termo anatômico já é universal). */
function translateMuscle(name) {
  return MUSCLE_TRANSLATIONS[name] || name;
}

const CATEGORIES = [10, 8, 12, 14, 15, 11, 9, 13];

function loadJson(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf-8'));
}

async function main() {
  const raw = loadJson('./wger-raw-export.json');

  let totalWritten = 0;
  const summary = [];

  for (const catId of CATEGORIES) {
    const rawList = raw[String(catId)] || raw[catId] || [];
    const translations = loadJson(`./translations-${catId}.json`);
    const trMap = new Map(translations.map((t) => [t.id, t]));

    const docs = [];
    for (const ex of rawList) {
      const tr = trMap.get(ex.id);
      if (!tr) {
        console.warn(`  WARNING: no translation found for exercise id ${ex.id} in category ${catId}, skipping`);
        continue;
      }

      const categoryNameEn = ex.category?.name || '';
      const categoryPt = CATEGORY_TRANSLATIONS[categoryNameEn] || categoryNameEn;

      const mainImage = ex.images.find((img) => img.is_main) || ex.images[0];

      docs.push({
        id: `wger-${ex.id}`,
        data: {
          wgerId: ex.id,
          name: tr.name,
          description: tr.description,
          categoryId: catId,
          category: categoryPt,
          muscles: (ex.muscles || []).map((m) => translateMuscle(m.name)),
          musclesSecondary: (ex.muscles_secondary || []).map((m) => translateMuscle(m.name)),
          equipment: ex.equipment && ex.equipment.length > 0 ? ex.equipment.map((e) => e.name) : ['none'],
          imageURL: mainImage.image,
          active: true,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
      });
    }

    // Batched writes, chunks of 100
    const CHUNK = 100;
    let written = 0;
    for (let i = 0; i < docs.length; i += CHUNK) {
      const chunk = docs.slice(i, i + CHUNK);
      const batch = db.batch();
      for (const d of chunk) {
        const ref = db.collection('exercises').doc(d.id);
        batch.set(ref, d.data, { merge: true });
      }
      await batch.commit();
      written += chunk.length;
      console.log(`  category ${catId}: ${written}/${docs.length} written`);
    }

    totalWritten += written;
    summary.push({ catId, name: CATEGORY_TRANSLATIONS[rawList[0]?.category?.name] || String(catId), count: written });
  }

  console.log('\nSync complete.');
  console.log(`Total exercises written: ${totalWritten}`);
  for (const s of summary) {
    console.log(`  ${s.name} (category ${s.catId}): ${s.count}`);
  }
}

main().catch((err) => {
  console.error('Fatal error during sync:', err);
  process.exit(1);
});
