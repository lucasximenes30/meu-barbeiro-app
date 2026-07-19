import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const barbershopId = (await params).slug; // since we passed barbershop.id in the URL
    const body = await req.json();
    const { conversationId, clientName, clientPhone, text, sender } = body;

    let conv;
    if (conversationId) {
      conv = await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          clientName: clientName || undefined,
          clientPhone: clientPhone || undefined,
          unread: true,
          status: 'active'
        }
      });
    } else {
      conv = await prisma.conversation.create({
        data: {
          barbershopId,
          clientName: clientName || 'Novo Cliente',
          clientPhone: clientPhone || '',
        }
      });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conv.id,
        sender,
        text
      }
    });

    return NextResponse.json({ success: true, conversationId: conv.id, messageId: message.id });
  } catch (error) {
    console.error('Chat sync API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
