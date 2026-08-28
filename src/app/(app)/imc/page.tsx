// ============================================
// Calculadora de IMC (Índice de Massa Corporal)
// ============================================
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Scale } from 'lucide-react';
import { Card } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { getSubDocument } from '@/lib/firebase/firestore';
import { calculateBMI, classifyBMI } from '@/lib/utils';

// Faixas oficiais da OMS, na ordem em que aparecem na régua visual
const BMI_RANGES = [
  { max: 18.5, label: 'Abaixo do peso', color: '#2f89c5' },
  { max: 25, label: 'Peso normal', color: '#0e9f6e' },
  { max: 30, label: 'Sobrepeso', color: '#ecb11f' },
  { max: 35, label: 'Obesidade grau I', color: '#f0870f' },
  { max: 40, label: 'Obesidade grau II', color: '#d24b4b' },
  { max: Infinity, label: 'Obesidade grau III', color: '#a52424' },
];

const SCALE_MIN = 14;
const SCALE_MAX = 44;

function getRangeColor(bmi: number): string {
  return BMI_RANGES.find((r) => bmi < r.max)?.color || '#a52424';
}

function getTip(bmi: number): string {
  if (bmi < 18.5) return 'Vale conversar com um profissional de saúde sobre ganho de peso saudável.';
  if (bmi < 25) return 'Seu IMC está na faixa considerada saudável. Continue com bons hábitos!';
  if (bmi < 30) return 'Pequenos ajustes na alimentação e atividade física já fazem diferença.';
  return 'Considere buscar acompanhamento profissional pra um plano seguro de emagrecimento.';
}

export default function ImcPage() {
  const { firebaseUser } = useAuthStore();
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  useEffect(() => {
    if (!firebaseUser) return;
    getSubDocument<{ weight?: number; height?: number }>('users', firebaseUser.uid, 'profile', 'current').then((p) => {
      if (p?.weight) setWeight(p.weight);
      if (p?.height) setHeight(p.height);
    });
  }, [firebaseUser]);

  const bmi = useMemo(() => calculateBMI(weight, height), [weight, height]);
  const classification = classifyBMI(bmi);
  const color = getRangeColor(bmi);
  const markerPercent = Math.min(100, Math.max(0, ((bmi - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100));

  return (
    <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
          <Scale className="w-6 h-6 text-[#0e9f6e]" /> Calculadora de IMC
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Índice de Massa Corporal — uma referência rápida, não um diagnóstico.
        </p>
      </div>

      <Card padding="lg" className="bg-white space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Peso (kg)</label>
            <input
              type="number"
              min={20}
              max={300}
              step={0.1}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value) || 0)}
              className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-[#d7ede3] text-lg font-bold text-neutral-900 focus-ring"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Altura (cm)</label>
            <input
              type="number"
              min={80}
              max={250}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value) || 0)}
              className="w-full mt-1.5 px-4 py-3 rounded-2xl border border-[#d7ede3] text-lg font-bold text-neutral-900 focus-ring"
            />
          </div>
        </div>

        {/* Resultado */}
        <div className="text-center py-4">
          <p className="text-6xl font-black tracking-tight" style={{ color }}>
            {bmi > 0 && isFinite(bmi) ? bmi.toFixed(1) : '--'}
          </p>
          <p className="text-sm font-bold mt-1" style={{ color }}>
            {classification}
          </p>
        </div>

        {/* Régua visual das faixas */}
        <div>
          <div className="relative h-3 rounded-full overflow-hidden flex">
            {BMI_RANGES.map((r) => (
              <div key={r.label} style={{ backgroundColor: r.color, flex: 1 }} />
            ))}
          </div>
          <div
            className="relative"
            style={{ height: 0 }}
          >
            <div
              className="absolute -top-[22px] w-4 h-4 rounded-full bg-white border-[3px] shadow-md -translate-x-1/2 transition-all duration-500"
              style={{ left: `${markerPercent}%`, borderColor: color }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400 mt-2">
            <span>Abaixo</span>
            <span>Normal</span>
            <span>Sobrepeso</span>
            <span>Obesidade</span>
          </div>
        </div>

        <p className="text-xs text-neutral-500 bg-[#f5faf7] border border-[#eaf3ef] rounded-2xl p-3.5 leading-relaxed">
          💡 {getTip(bmi)}
        </p>

        <p className="text-[11px] text-neutral-400 text-center">
          O IMC não considera massa muscular, idade ou distribuição de gordura — use como referência geral, não diagnóstico.
        </p>
      </Card>
    </div>
  );
}
