// ============================================
// Photo Comparison (Antes & Depois) Component
// ============================================
'use client';

import { useState } from 'react';
import { Card, Button } from '@/components/ui';

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
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=500&q=80';

  const defaultAfter =
    afterPhotoURL ||
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=500&q=80';

  return (
    <Card padding="md" className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
        <div>
          <h3 className="font-bold text-neutral-900 text-base sm:text-lg flex items-center gap-2">
            <span>📸</span>
            <span>Comparativo Visual (Antes & Depois)</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            A balança não mostra a troca de gordura por massa magra. As fotos não mentem!
          </p>
        </div>

        {/* Angle selector */}
        <div className="flex gap-1.5 bg-neutral-100 p-1 rounded-xl self-start sm:self-auto text-xs">
          {(['front', 'side', 'back'] as const).map((angle) => (
            <button
              key={angle}
              type="button"
              onClick={() => setActiveAngle(angle)}
              className={`
                px-3 py-1 rounded-lg font-semibold capitalize transition-colors
                ${activeAngle === angle
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800'
                }
              `}
            >
              {angle === 'front' ? 'Frente' : angle === 'side' ? 'Perfil' : 'Costas'}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-side comparison images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Before */}
        <div className="space-y-2">
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 group">
            <img
              src={defaultBefore}
              alt="Foto Antes"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
              Início ({beforeDate})
            </span>
          </div>
        </div>

        {/* After / Current */}
        <div className="space-y-2">
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-neutral-100 border-2 border-emerald-500 shadow-sm group">
            <img
              src={defaultAfter}
              alt="Foto Depois / Atual"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-emerald-600 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
              Evolução ({afterDate})
            </span>
          </div>
        </div>
      </div>

      {/* Upload Action & Privacy Note */}
      <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-neutral-500">
          <span>🔒</span>
          <span>
            Suas fotos são <strong>100% privadas e confidenciais</strong>, salvas com segurança no seu perfil.
          </span>
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onUploadPhoto) onUploadPhoto(activeAngle, file);
            }}
          />
          <Button variant="primary" size="sm" className="whitespace-nowrap pointer-events-none">
            + Adicionar Nova Foto
          </Button>
        </label>
      </div>
    </Card>
  );
}
