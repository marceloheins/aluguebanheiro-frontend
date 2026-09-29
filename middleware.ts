import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('saas_token')?.value;
  const { pathname } = request.url ? new URL(request.url) : { pathname: request.nextUrl.pathname };

  const isLoginRoute = pathname.startsWith('/login');
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Se for a rota de login e o usuário já tem token, podemos deixá-lo na tela de login 
  // (ou redirecionar. Permitir o acesso ao login evita que você fique preso!)
  if (isLoginRoute) {
    return NextResponse.next();
  }

  // Se for uma rota protegida (como o dashboard) e NÃO tiver token, manda para o login
  if (isDashboardRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configuração dosmatchers para o middleware rodar apenas nas rotas necessárias
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};