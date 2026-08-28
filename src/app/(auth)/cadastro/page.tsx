// ============================================
// /cadastro — desativado: acesso só é liberado via pagamento.
// Cadastro grátis direto contrariava a regra de negócio (só entra
// quem paga), então essa rota agora só redireciona pro checkout,
// que já cria a conta certinho no momento da confirmação do Pix.
// ============================================
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default function CadastroPage() {
  redirect(ROUTES.CHECKOUT);
}
