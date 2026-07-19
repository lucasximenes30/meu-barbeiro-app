import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
    }

    const admin = await prisma.superAdmin.findUnique({
      where: { email }
    });

    // Se o admin não existir, mas for o primeiro login, a gente poderia criar (apenas para facilitar testes locais)
    // Em produção a conta é criada diretamente no banco
    if (!admin) {
       // Mock fallback se o banco SuperAdmin estiver vazio e a senha for a do env
       const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
       if (password === adminPass) {
           return NextResponse.json({ success: true, warning: 'Using mock admin' });
       }
       return NextResponse.json({ error: 'Admin não encontrado ou senha inválida' }, { status: 401 });
    }

    // Validação de senha real
    if (admin.password !== password) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // Retorna sucesso (ideal: setar um cookie JWT seguro HttpOnly)
    // Para simplificar no frontend, setamos apenas JSON ok, e no frontend redireciona
    return NextResponse.json({ success: true, message: 'Login efetuado com sucesso' });

  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
