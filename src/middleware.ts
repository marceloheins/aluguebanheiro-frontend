// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('saas_token')?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  let isValidToken = false;

  if (token) {
    try {
      // Converte o segredo do backend em Uint8Array exigido pelo jose
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'seu_segredo_jwt_super_secreto');
      
      // Valida a assinatura criptográfica e a expiração do token
      await jwtVerify(token, secret);
      isValidToken = true;
    } catch (error) {
      // Token adulterado, expirado ou inválido
      isValidToken = false;
    }
  }

  // 1. Se não tem token válido e tenta acessar uma rota protegida -> Manda para o login
  if (!isValidToken && !isLoginPage) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Se havia um token inválido, limpa o cookie corrompido
    response.cookies.delete('saas_token');
    return response;
  }

  // 2. Se já tem um token VÁLIDO e tenta acessar a tela de login -> Manda para o dashboard
  if (isValidToken && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configura quais rotas o Middleware deve interceptar
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};