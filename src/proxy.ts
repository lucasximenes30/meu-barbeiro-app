import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  // Rotas protegidas
  const protectedRoutes = [
    '/dashboard',
    '/agendamento',
    '/clientes',
    '/produtos',
    '/servicos',
    '/financeiro',
    '/configuracoes'
  ];

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && token !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redireciona para o dashboard se estiver logado e tentar acessar o login ou home
  if (
    (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/') && 
    token === 'authenticated'
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redireciona a raiz para login se não estiver logado
  if (request.nextUrl.pathname === '/' && token !== 'authenticated') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
