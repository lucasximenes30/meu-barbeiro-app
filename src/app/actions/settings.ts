'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

async function getBarbershopId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) throw new Error('Não autorizado');
  
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-for-dev-only');
  const { payload } = await jwtVerify(token, secret);
  const barbershopId = payload.barbershopId as string;

  if (!barbershopId) throw new Error('Barbearia não encontrada');
  return barbershopId;
}

export async function getBarbershopProfile() {
  try {
    const barbershopId = await getBarbershopId();
    const barbershop = await prisma.barbershop.findUnique({
      where: { id: barbershopId },
      select: { name: true, phone: true, address: true }
    });
    
    return { success: true, data: barbershop };
  } catch (error) {
    console.error('Get profile error:', error);
    return { success: false, error: 'Erro ao buscar perfil' };
  }
}

export async function updateBarbershopProfile(data: { name: string, phone: string, address: string }) {
  try {
    const barbershopId = await getBarbershopId();
    await prisma.barbershop.update({
      where: { id: barbershopId },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'Erro ao atualizar perfil' };
  }
}
