// ============================================
// Photo Comparison (Antes & Depois) — Mindfit Real Photos & Upload
// ============================================
'use client';

import { useState, useEffect } from 'react';

export function PhotoComparison() {
  const [activeAngle, setActiveAngle] = useState<'front' | 'side' | 'back'>('front');
  const [photos, setPhotos] = useState<{
    frontBefore?: string;
    frontAfter?: string;
    sideBefore?: string;
    sideAfter?: string;
    backBefore?: string;
    backAfter?: string;
  }>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mindfit_user_photos');
      if (saved) {
        setPhotos(JSON.parse(saved));
      }
    } catch {
      // localStorage policy
    }
  }, []);

  const handleUpload = (type: 'before' | 'after', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const key = `${activeAngle}${type === 'before' ? 'Before' : 'After'}` as keyof typeof photos;
      const updated = { ...photos, [key]: dataUrl };
      setPhotos(updated);
      try {
        localStorage.setItem('mindfit_user_photos', JSON.stringify(updated));
      } catch {
        // storage overflow
      }
    };
    reader.readAsDataURL(file);
  };

  const beforeKey = `${activeAngle}Before` as keyof typeof photos;
  const afterKey = `${activeAngle}After` as keyof typeof photos;
  const beforePhoto = photos[beforeKey];
  const afterPhoto = photos[afterKey];

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
        {/* Before Photo */}
        {beforePhoto ? (
          <div className="compare-item" style={{ backgroundImage: `url('${beforePhoto}')` }}>
            <span className="cl">Início (Dia 1)</span>
            <label
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '50px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
              }}
            >
              Trocar foto
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload('before', f);
                }}
              />
            </label>
          </div>
        ) : (
          <label
            className="compare-item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f6fbf8',
              border: '2px dashed #cdeadd',
              cursor: 'pointer',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📷</span>
            <b style={{ color: '#12352f', fontSize: '0.95rem', fontFamily: "'Poppins', sans-serif" }}>
              Foto Inicial ({activeAngle === 'front' ? 'Frente' : activeAngle === 'side' ? 'Perfil' : 'Costas'})
            </b>
            <span style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '4px' }}>
              Clique para enviar sua foto do Dia 1
            </span>
            <span className="btn btn-ghost btn-sm" style={{ marginTop: '14px', pointerEvents: 'none' }}>
              + Enviar Foto
            </span>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload('before', f);
              }}
            />
          </label>
        )}

        {/* After / Evolution Photo */}
        {afterPhoto ? (
          <div className="compare-item now" style={{ backgroundImage: `url('${afterPhoto}')` }}>
            <span className="cl" style={{ background: 'var(--green)' }}>
              Evolução (Atual)
            </span>
            <label
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '50px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
              }}
            >
              Trocar foto
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload('after', f);
                }}
              />
            </label>
          </div>
        ) : (
          <label
            className="compare-item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f6fbf8',
              border: '2px dashed #0e9f6e',
              cursor: 'pointer',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✨</span>
            <b style={{ color: 'var(--green)', fontSize: '0.95rem', fontFamily: "'Poppins', sans-serif" }}>
              Foto de Evolução ({activeAngle === 'front' ? 'Frente' : activeAngle === 'side' ? 'Perfil' : 'Costas'})
            </b>
            <span style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '4px' }}>
              Envie sua foto recente para ver a transformação
            </span>
            <span className="btn btn-primary btn-sm" style={{ marginTop: '14px', pointerEvents: 'none' }}>
              + Enviar Foto Atual
            </span>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload('after', f);
              }}
            />
          </label>
        )}
      </div>

      <div style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>🔒</span>
        <span>Suas fotos são 100% privadas e confidenciais, salvas com segurança no seu dispositivo/perfil.</span>
      </div>
    </div>
  );
}
