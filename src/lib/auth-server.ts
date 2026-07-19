import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-for-dev-only');

export async function getAuthBarbershopId(req: NextRequest): Promise<string> {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) throw new Error('Não autorizado');

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.barbershopId) throw new Error('Barbearia não encontrada no token');
    return payload.barbershopId as string;
  } catch (err) {
    throw new Error('Token inválido');
  }
}
