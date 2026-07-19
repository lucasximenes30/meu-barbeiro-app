import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Preencha e-mail e senha' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@barbearia.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

    // Mock fallback executado antes do DB para garantir o acesso mesmo se houver erro no banco
    if (email === adminEmail && password === adminPass) {
      const response = NextResponse.json({ success: true, message: 'Logged in with Mock' });
      response.cookies.set('auth_token', 'mock_admin', { httpOnly: true, path: '/' });
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

    // Em produção você deve comparar a senha usando bcrypt (ex: bcrypt.compareSync)
    // Aqui estamos verificando direto pois no /api/cadastro também salvamos em plain text para facilitar o MVP.
    if (user && user.password === password) {
      // Set cookie to simulate session
      const response = NextResponse.json({ 
        success: true, 
        message: 'Logged in successfully',
        user: { id: user.id, name: user.name, barbershopId: user.barbershopId }
      });
      
      response.cookies.set('auth_token', user.id, {
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
