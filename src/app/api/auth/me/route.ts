import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-for-dev-only');

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    if (payload.role === 'SUPER_ADMIN') {
      return NextResponse.json({ user: payload, barbershop: null });
    }

    const barbershop = await prisma.barbershop.findUnique({
      where: { id: payload.barbershopId as string },
      select: { id: true, name: true, isActive: true }
    });

    return NextResponse.json({ user: payload, barbershop });
  } catch (err) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
