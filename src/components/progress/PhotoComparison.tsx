// ============================================
// Photo Comparison (Antes & Depois) — Mindfit Reference Design
// ============================================
'use client';

import { useState } from 'react';

interface PhotoComparisonProps {
  beforePhotoURL?: string;
  afterPhotoURL?: string;
  beforeDate?: string;
  afterDate?: string;
  onUploadPhoto?: (type: 'front' | 'side' | 'back', file: File) => void;
}

export function PhotoComparison({
  beforePhotoURL,
  afterPhotoURL,
  beforeDate = 'Dia 1',
  afterDate = 'Hoje',
  onUploadPhoto,
}: PhotoComparisonProps) {
  const [activeAngle, setActiveAngle] = useState<'front' | 'side' | 'back'>('front');

  const defaultBefore =
    beforePhotoURL ||
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=70';

  const defaultAfter =
    afterPhotoURL ||
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=70';

  return (
    <div className="card" style={{ marginBottom: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            📷 Comparativo Visual (Antes &amp; Depois)
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            A balança não mostra a troca de gordura por massa magra. As fotos não mentem!
          </p>
        </div>
        <div className="compare-tabs">
          <button
            className={activeAngle === 'front' ? 'active' : ''}
            onClick={() => setActiveAngle('front')}
          >
            Frente
          </button>
          <button
            className={activeAngle === 'side' ? 'active' : ''}
            onClick={() => setActiveAngle('side')}
          >
            Perfil
          </button>
          <button
            className={activeAngle === 'back' ? 'active' : ''}
            onClick={() => setActiveAngle('back')}
          >
            Costas
          </button>
        </div>
      </div>

      <div className="compare-grid">
        <div className="compare-item" style={{ backgroundImage: `url('${defaultBefore}')` }}>
          <span className="cl">Início ({beforeDate})</span>
        </div>
        <div className="compare-item now" style={{ backgroundImage: `url('${defaultAfter}')` }}>
          <span className="cl" style={{ background: 'var(--green)' }}>
            Evolução ({afterDate})
          </span>
        </div>
      </div>
    </div>
  );
}
