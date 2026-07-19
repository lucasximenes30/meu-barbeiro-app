import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-for-dev-only');

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  // Rotas protegidas (Painel Barbeiro)
  const dashboardRoutes = [
    '/dashboard',
    '/agendamento',
    '/clientes',
    '/produtos',
    '/servicos',
    '/financeiro',
    '/configuracoes'
  ];
  
  // Rotas protegidas (Painel Super Admin)
  const adminRoutes = [
    '/admin'
  ];

  const pathname = request.nextUrl.pathname;
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = isDashboardRoute || isAdminRoute;

  let decodedToken = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      decodedToken = payload;
    } catch (err) {
      console.warn('Token inválido ou expirado:', err);
      const res = pathname === '/login' ? NextResponse.next() : NextResponse.redirect(new URL('/login', request.url));
      res.cookies.delete('auth_token');
      return res;
    }
  }

  // Redireciona para o login se tentar acessar rota protegida sem token válido
  if (isProtectedRoute && !decodedToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (decodedToken) {
    const role = decodedToken.role as string;

    // Se tentar acessar o root ou login já estando logado, redireciona pro painel correto
    if (pathname === '/' || pathname === '/login') {
      if (role === 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Se é SUPER_ADMIN e tenta acessar dashboard, podemos deixar ou redirecionar
    // (opcional: redirecionar SUPER_ADMIN para /admin se ele não pode ver o dashboard, 
    // mas talvez o SUPER_ADMIN possa ver, então por enquanto só garantimos que Barbeiros não vejam /admin)
    if (isAdminRoute && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // Redireciona a raiz para login se não estiver logado
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
