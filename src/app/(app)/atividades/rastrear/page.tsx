// ============================================
// Rastreio ao vivo — wrapper (useSearchParams exige Suspense)
// ============================================
import { Suspense } from 'react';
import { ActivityTrackerClient } from './ActivityTrackerClient';

export const dynamic = 'force-dynamic';

export default function AtividadeRastrearPage() {
  return (
    <Suspense fallback={null}>
      <ActivityTrackerClient />
    </Suspense>
  );
}
