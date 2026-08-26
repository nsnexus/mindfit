// ============================================
// Workout Questionnaire Modal — Mindfit
// ============================================
'use client';

import { useState } from 'react';
import {
  generateCustomWorkoutFromWger,
  type WorkoutQuestionnaireData,
} from '@/lib/wgerApi';

interface WorkoutQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkoutGenerated: (workout: any) => void;
  initialWeight?: number;
  initialGoalWeight?: number;
  initialHeight?: number;
}

export function WorkoutQuestionnaireModal({
  isOpen,
  onClose,
  onWorkoutGenerated,
  initialWeight = 70,
  initialGoalWeight = 63,
  initialHeight = 165,
}: WorkoutQuestionnaireModalProps) {
  const [formData, setFormData] = useState<WorkoutQuestionnaireData>({
    weight: initialWeight,
    goalWeight: initialGoalWeight,
    height: initialHeight,
    fitnessLevel: 'beginner',
    goal: 'lose',
    focus: 'fullBody',
    equipment: 'none',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const generated = await generateCustomWorkoutFromWger(formData);
      // Salva no localStorage para persistir na sessão
      localStorage.setItem('mindfit_custom_workout', JSON.stringify(generated));
      onWorkoutGenerated(generated);
      onClose();
    } catch (err) {
      console.error('Erro ao gerar treino da API:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 53, 47, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '520px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span className="page-tag" style={{ marginBottom: '6px' }}>
              🎯 Treino Personalizado Inteligente
            </span>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.4rem', color: '#12352f' }}>
              Avaliação de Treino do Aluno
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f5faf7',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              fontSize: '1.2rem',
              color: '#5b7a72',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '22px' }}>
          Preencha suas medidas e preferências. Consultaremos a <b>biblioteca de exercícios da API (860+ itens)</b> para montar sua rotina ideal.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Medidas: Peso Atual e Meta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#12352f', marginBottom: '6px' }}>
                Peso Atual (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid #cdeadd',
                  borderRadius: '12px',
                  fontFamily: 'Inter',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#12352f', marginBottom: '6px' }}>
                Meta de Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.goalWeight || ''}
                onChange={(e) => setFormData({ ...formData, goalWeight: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid #cdeadd',
                  borderRadius: '12px',
                  fontFamily: 'Inter',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Nível de Condicionamento */}
          <div>
            <label style={{ display: 'block', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#12352f', marginBottom: '8px' }}>
              Seu Nível de Condicionamento
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'beginner', label: 'Iniciante' },
                { id: 'intermediate', label: 'Intermediário' },
                { id: 'advanced', label: 'Avançado' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, fitnessLevel: lvl.id as any })}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '12px',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    border: formData.fitnessLevel === lvl.id ? '2px solid #0e9f6e' : '1.5px solid #eaf3ef',
                    background: formData.fitnessLevel === lvl.id ? '#e6f6ef' : '#fff',
                    color: formData.fitnessLevel === lvl.id ? '#0e9f6e' : '#5b7a72',
                    cursor: 'pointer',
                    transition: '0.2s',
                  }}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Foco Muscular Prioritário */}
          <div>
            <label style={{ display: 'block', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#12352f', marginBottom: '8px' }}>
              Foco Muscular do Treino
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { id: 'fullBody', label: '🔥 Corpo Todo (Full Body)' },
                { id: 'abs', label: '🧱 Abdômen & Core' },
                { id: 'legs', label: '🦵 Pernas & Glúteos' },
                { id: 'arms', label: '💪 Braços & Ombros' },
                { id: 'back', label: '🧘 Costas & Postura' },
              ].map((foc) => (
                <button
                  key={foc.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, focus: foc.id as any })}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    textAlign: 'left',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    border: formData.focus === foc.id ? '2px solid #0e9f6e' : '1.5px solid #eaf3ef',
                    background: formData.focus === foc.id ? '#e6f6ef' : '#fff',
                    color: formData.focus === foc.id ? '#0e9f6e' : '#12352f',
                    cursor: 'pointer',
                    transition: '0.2s',
                  }}
                >
                  {foc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Equipamento Disponível */}
          <div>
            <label style={{ display: 'block', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#12352f', marginBottom: '8px' }}>
              Equipamento Disponível
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'none', label: '🏠 Apenas Corpo' },
                { id: 'dumbbells', label: '🏋️ Halteres / Elástico' },
                { id: 'gym', label: '🏢 Academia' },
              ].map((eq) => (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, equipment: eq.id as any })}
                  style={{
                    padding: '10px 8px',
                    borderRadius: '12px',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    border: formData.equipment === eq.id ? '2px solid #0e9f6e' : '1.5px solid #eaf3ef',
                    background: formData.equipment === eq.id ? '#e6f6ef' : '#fff',
                    color: formData.equipment === eq.id ? '#0e9f6e' : '#5b7a72',
                    cursor: 'pointer',
                    transition: '0.2s',
                  }}
                >
                  {eq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Botão de Geração */}
          <button
            type="submit"
            disabled={isGenerating}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '15px 24px',
              fontSize: '1rem',
              marginTop: '10px',
              opacity: isGenerating ? 0.7 : 1,
            }}
          >
            {isGenerating ? 'Consultando API wger & Montando...' : '🚀 Gerar Treino da API wger.de'}
          </button>
        </form>
      </div>
    </div>
  );
}
