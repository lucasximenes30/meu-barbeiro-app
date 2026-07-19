'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function getPublicChatSettings() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) throw new Error('Não autorizado');
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
    const { payload } = await jwtVerify(token, secret);
    const barbershopId = payload.barbershopId as string;

    if (!barbershopId) throw new Error('Barbearia não encontrada');

    const barbershop = await prisma.barbershop.findUnique({
      where: { id: barbershopId },
      select: { slug: true, logoUrl: true, welcomeMessage: true },
    });

    return { 
      success: true, 
      data: barbershop
    };
  } catch (error) {
    console.error('Get public chat settings error:', error);
    return { success: false, error: 'Erro ao buscar configurações' };
  }
}

export async function savePublicChatSettings(data: { slug?: string, logoUrl?: string, welcomeMessage?: string }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) throw new Error('Não autorizado');
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
    const { payload } = await jwtVerify(token, secret);
    const barbershopId = payload.barbershopId as string;

    if (!barbershopId) throw new Error('Barbearia não encontrada');

    // Validação de unicidade do slug
    if (data.slug) {
      // Remover espaços e caracteres especiais para formar o slug
      const slugFormatted = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      
      const existing = await prisma.barbershop.findFirst({
        where: { slug: slugFormatted, NOT: { id: barbershopId } },
      });

      if (existing) {
        return { success: false, error: 'Este slug já está em uso por outra barbearia.', code: 'DUPLICATE_SLUG' };
      }

      data.slug = slugFormatted;
    }

    await prisma.barbershop.update({
      where: { id: barbershopId },
      data: {
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.welcomeMessage !== undefined && { welcomeMessage: data.welcomeMessage }),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Save public chat settings error:', error);
    return { success: false, error: 'Erro ao salvar configurações' };
  }
}
