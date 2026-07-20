'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getConversations() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) throw new Error('Não autorizado');
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const barbershopId = payload.barbershopId as string;
    
    if (!barbershopId) throw new Error('Barbearia não encontrada');

    const conversations = await prisma.conversation.findMany({
      where: { barbershopId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        },
        customer: true,
      },
      orderBy: { updatedAt: 'desc' }
    });

    return { success: true, data: conversations };
  } catch (error) {
    console.error('Get conversations error:', error);
    return { success: false, error: 'Erro ao buscar conversas' };
  }
}

export async function sendMessage(conversationId: string, text: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) throw new Error('Não autorizado');
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const barbershopId = payload.barbershopId as string;
    if (!barbershopId) throw new Error('Barbearia não encontrada');

    // Verifica se a conversa existe e pertence à barbearia
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, barbershopId }
    });

    if (!conversation) {
      throw new Error('Conversa não encontrada');
    }

    // Cria a mensagem e atualiza a conversa em uma transação
    await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          sender: 'barber',
          text
        }
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: {
          status: 'human', // Pausa o robô
          unread: false
        }
      })
    ]);

    return { success: true };
  } catch (error) {
    console.error('Send message error:', error);
    return { success: false, error: 'Erro ao enviar mensagem' };
  }
}
