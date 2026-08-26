# 🍃 Mindfit — Método 21 Dias

> Plataforma completa de emagrecimento saudável, reeducação alimentar, treinos guiados em casa e gamificação em ciclos sustentáveis de 21 dias.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-v12-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Deploy-Cloudflare%20Workers-f38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com/)

---

## 🎯 Visão Geral dos Módulos

1. **Autenticação Segura & PWA**: Login e cadastro exclusivos por e-mail e senha via Firebase Auth, proteção de rotas com controle de acesso baseado em papéis (`admin`/`user`), PWA instalável no celular.
2. **Onboarding Personalizado**: Wizard científico de 5 etapas que calcula Taxa Metabólica Basal (Mifflin-St Jeor), Gasto Energético Total (GET), meta calórica diária segura (mínimo de 1.200 kcal) e distribuição balanceada de macronutrientes.
3. **Nutrição & Diário Alimentar**:
   - Banco de alimentos brasileiros (~150 itens) com **Semáforo Volumétrico** de Barbara Rolls (Verde, Amarelo, Vermelho).
   - Cardápios estruturados de 21 dias divididos em 3 Fases (Fase 1: Preparação, Fase 2: Controle, Fase 3: Consistência).
   - Diário alimentar com contador calórico em tempo real, progresso de macros, hidratação rápida e peso diário.
4. **Catálogo de Receitas & Lista de Compras**:
   - Dezenas de receitas saudáveis com filtros por categoria (Café, Almoço, Jantar, Lanches, Sobremesas Fit) e dieta (Low-Carb, Vegano, Proteico, Rápido ≤ 15 min).
   - Gerador automático de lista de compras organizado por corredores de supermercado (Hortifrúti, Carnes, Laticínios, Mercearia, Temperos) com exportação para WhatsApp.
5. **Treinos Guiados em Casa**:
   - Biblioteca de exercícios com dicas de execução e postura.
   - Sessão ativa com cronômetro sonoro interativo (bips via Web Audio API, 100% offline) e recompensas calóricas.
6. **Progresso & Gamificação Acolhedora**:
   - Gráfico de evolução de peso com linha de meta.
   - Comparativo visual de fotos Antes & Depois protegido por privacidade.
   - Streaks com **Freeze Gentil** (2 perdões de descanso por ciclo sem quebra de sequência).
   - Quadro de conquistas e badges desbloqueáveis.
7. **Landing Page, Checkout Éfi Bank & Painel Admin**:
   - Landing page moderna de alta conversão (`/`) com FAQ, depoimentos e aviso ético de saúde.
   - Checkout integrado com geração de Pix QR Code e Copia e Cola via API Éfi Bank (`/checkout`).
   - Painel Administrativo (`/admin`) com métricas de receita, tabela de usuários e CRUD completo de receitas e treinos.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Estilização**: Tailwind CSS v4 com paleta personalizada (Esmeralda & Âmbar)
- **Estado Global**: Zustand
- **Data Fetching**: TanStack React Query v5
- **Backend & Banco de Dados**: Firebase Auth, Cloud Firestore e Cloud Storage
- **Gateway de Pagamento**: Éfi Bank (Pix EMV e Cartão)
- **Deploy**: Cloudflare Workers / OpenNext

---

## 🚀 Como Executar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/nsnexus/mindfit.git
cd mindfit
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente
Crie o arquivo `.env.local` na raiz do projeto (use `.env.example` como base):

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mindfit-d14f7.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mindfit-d14f7
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mindfit-d14f7.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=133329052719
NEXT_PUBLIC_FIREBASE_APP_ID=1:133329052719:web:b54af460b83255563712da
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-6TJFCRLX1N

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Mindfit
```

### 4. Rodar o servidor de desenvolvimento
```bash
npm run dev
```

Acesse em **[http://localhost:3000](http://localhost:3000)**.

---

## 📦 Build para Produção
```bash
npm run build
```

---

## 📄 Licença & Aviso de Saúde
Consulte os termos de uso e política de privacidade. As diretrizes fornecidas na plataforma não substituem a consulta médica ou nutricional individualizada.
