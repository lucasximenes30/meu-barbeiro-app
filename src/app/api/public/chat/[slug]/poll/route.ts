import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = req.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ success: false, error: 'Missing conversationId' }, { status: 400 });
    }

    const barbershop = await prisma.barbershop.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!barbershop) {
      return NextResponse.json({ success: false, error: 'Barbearia não encontrada' }, { status: 404 });
    }

    // Busca apenas as mensagens enviadas pelo barbeiro para essa conversa
    const newMessages = await prisma.message.findMany({
      where: {
        conversationId,
        sender: 'barber'
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        text: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      messages: newMessages.map(m => ({
        id: m.id,
        text: m.text,
        sender: 'barber',
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
    });

  } catch (error) {
    console.error('Polling chat error:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar mensagens' }, { status: 500 });
  }
}
