// One-time fetch of curated exercise data from wger.de public API.
// Filters to: has at least 1 image AND has a valid English translation
// (name + description both non-empty). Writes raw wger objects to
// scripts/wger-raw-export.json for resumability / reference.
import { writeFileSync, existsSync, readFileSync } from 'fs';

const WGER_BASE_URL = 'https://wger.de/api/v2';
const OUT_FILE = new URL('./wger-raw-export.json', import.meta.url);

const CATEGORIES = [
  { id: 10, name: 'Abs' },
  { id: 8, name: 'Arms' },
  { id: 12, name: 'Back' },
  { id: 14, name: 'Calves' },
  { id: 15, name: 'Cardio' },
  { id: 11, name: 'Chest' },
  { id: 9, name: 'Legs' },
  { id: 13, name: 'Shoulders' },
];

async function fetchAllForCategory(categoryId) {
  const results = [];
  let url = `${WGER_BASE_URL}/exerciseinfo/?limit=50&offset=0&language=2&category=${categoryId}`;

  while (url) {
    let data = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
        break;
      } catch (err) {
        console.error(`  fetch error (attempt ${attempt + 1}):`, err.message);
        await new Promise((r) => setTimeout(r, 800));
      }
    }
    if (!data) {
      console.error(`  giving up on ${url}`);
      break;
    }
    results.push(...data.results);
    url = data.next;
  }

  return results;
}

function getEnglishTranslation(exercise) {
  const translations = exercise.translations || [];
  return translations.find((t) => t.language === 2) || null;
}

function filterExercise(exercise) {
  if (!exercise.images || exercise.images.length === 0) return false;
  const en = getEnglishTranslation(exercise);
  if (!en) return false;
  if (!en.name || !en.name.trim()) return false;
  if (!en.description || !en.description.trim()) return false;
  return true;
}

async function main() {
  let existing = {};
  if (existsSync(OUT_FILE)) {
    try {
      existing = JSON.parse(readFileSync(OUT_FILE, 'utf-8'));
    } catch {
      existing = {};
    }
  }

  const byCategory = { ...existing };

  for (const cat of CATEGORIES) {
    if (byCategory[cat.id] && byCategory[cat.id].length > 0) {
      console.log(`Skipping ${cat.name} (id ${cat.id}) — already fetched, ${byCategory[cat.id].length} exercises`);
      continue;
    }
    console.log(`Fetching category ${cat.name} (id ${cat.id})...`);
    const all = await fetchAllForCategory(cat.id);
    const filtered = all.filter(filterExercise);
    console.log(`  ${cat.name}: ${all.length} total, ${filtered.length} kept (image + valid EN text)`);

    // Trim to only the fields we need
    const trimmed = filtered.map((ex) => {
      const en = getEnglishTranslation(ex);
      const mainImg = ex.images.find((img) => img.is_main) || ex.images[0];
      return {
        id: ex.id,
        category: ex.category,
        images: ex.images,
        mainImage: mainImg.image,
        muscles: ex.muscles || [],
        muscles_secondary: ex.muscles_secondary || [],
        equipment: ex.equipment || [],
        en_name: en.name.trim(),
        en_description: en.description.trim(),
      };
    });

    byCategory[cat.id] = trimmed;
    writeFileSync(OUT_FILE, JSON.stringify(byCategory, null, 2), 'utf-8');
    console.log(`  saved progress to ${OUT_FILE.pathname}`);
  }

  const total = Object.values(byCategory).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`\nDone. Total exercises across all categories: ${total}`);
  for (const cat of CATEGORIES) {
    console.log(`  ${cat.name}: ${byCategory[cat.id]?.length || 0}`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
