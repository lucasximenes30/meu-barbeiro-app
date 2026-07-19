'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function saveAutomations(automations: Record<string, boolean>) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) throw new Error('Não autorizado');
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
    const { payload } = await jwtVerify(token, secret);
    const barbershopId = payload.barbershopId as string;

    if (!barbershopId) throw new Error('Barbearia não encontrada');

    // Upsert settings with the automations JSON
    await prisma.settings.upsert({
      where: { barbershopId },
      create: {
        barbershopId,
        automations: automations as any,
      },
      update: {
        automations: automations as any,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Save automations error:', error);
    return { success: false, error: 'Erro ao salvar automações' };
  }
}

export async function getAutomations() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) throw new Error('Não autorizado');
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
    const { payload } = await jwtVerify(token, secret);
    const barbershopId = payload.barbershopId as string;

    if (!barbershopId) throw new Error('Barbearia não encontrada');

    const settings = await prisma.settings.findUnique({
      where: { barbershopId },
      select: { automations: true },
    });

    return { 
      success: true, 
      automations: settings?.automations || {
        reminder24h: true,
        satisfaction: true,
        return30d: false
      } 
    };
  } catch (error) {
    console.error('Get automations error:', error);
    return { success: false, error: 'Erro ao buscar automações' };
  }
}
