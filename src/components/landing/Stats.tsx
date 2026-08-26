// ============================================
// Landing Page: Stats Bar — Mindfit
// ============================================
export function Stats() {
  return (
    <section className="bg-[#0f5e5a] text-white py-12 px-6">
      <div className="max-w-[1180px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-[var(--font-heading)] font-extrabold text-4xl sm:text-5xl bg-gradient-to-r from-[#8bc34a] to-[#1aa8a0] bg-clip-text text-transparent">
              21
            </div>
            <div className="text-[#bfe0d5] text-sm mt-1 font-medium">
              dias por ciclo de transformação
            </div>
          </div>

          <div>
            <div className="font-[var(--font-heading)] font-extrabold text-4xl sm:text-5xl bg-gradient-to-r from-[#8bc34a] to-[#1aa8a0] bg-clip-text text-transparent">
              500+
            </div>
            <div className="text-[#bfe0d5] text-sm mt-1 font-medium">
              receitas e treinos guiados
            </div>
          </div>

          <div>
            <div className="font-[var(--font-heading)] font-extrabold text-4xl sm:text-5xl bg-gradient-to-r from-[#8bc34a] to-[#1aa8a0] bg-clip-text text-transparent">
              12k+
            </div>
            <div className="text-[#bfe0d5] text-sm mt-1 font-medium">
              usuários ativos
            </div>
          </div>

          <div>
            <div className="font-[var(--font-heading)] font-extrabold text-4xl sm:text-5xl bg-gradient-to-r from-[#8bc34a] to-[#1aa8a0] bg-clip-text text-transparent">
              4,9★
            </div>
            <div className="text-[#bfe0d5] text-sm mt-1 font-medium">
              avaliação média
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
