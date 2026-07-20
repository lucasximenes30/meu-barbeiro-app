import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Preencha e-mail e senha' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    const adminPass = process.env.ADMIN_PASSWORD?.trim();

    // Log para depuração caso a variável não esteja carregando corretamente
    if (process.env.NODE_ENV === 'development') {
      console.log('Login attempt:', email, '| Configured ADMIN:', adminEmail);
    }

    // Mock fallback executado antes do DB para garantir o acesso mesmo se houver erro no banco
    if (adminEmail && adminPass && email === adminEmail && password === adminPass) {
      const token = await new SignJWT({ id: 'mock_admin', role: 'SUPER_ADMIN', name: 'Admin Supremo' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
        
      const response = NextResponse.json({ success: true, message: 'Logged in with Mock', role: 'SUPER_ADMIN' });
      response.cookies.set('auth_token', token, { httpOnly: true, path: '/' });
      return response;
    }

    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } catch (dbError) {
      console.warn('Banco de dados indisponível para login:', dbError);
    }

    if (user && user.password === password) {
      const token = await new SignJWT({ id: user.id, role: user.role, name: user.name, barbershopId: user.barbershopId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
        
      const response = NextResponse.json({ 
        success: true, 
        message: 'Logged in successfully',
        role: user.role,
        user: { id: user.id, name: user.name, barbershopId: user.barbershopId }
      });
      
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      
      return response;
    }

    return NextResponse.json({ success: false, message: 'Usuário ou senha incorretos' }, { status: 401 });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Erro interno no servidor' }, { status: 500 });
  }
}
