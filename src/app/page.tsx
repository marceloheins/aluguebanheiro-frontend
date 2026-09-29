import { redirect } from 'next/navigation';

export default function RootPage() {
  // Como o grupo (dashboard) mapeia para a raiz do seu painel, 
  // redirecionamos o acesso raiz para a página principal ou visao operacional
  redirect('/dashboard'); // ou se o usuário estiver logado, exibe o dashboard
}