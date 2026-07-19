import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const shop = await prisma.barbershop.findUnique({
      where: { id }
    });
    if (!shop) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    return NextResponse.json(shop);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, phone, subscriptionFee, isActive } = body;

    const parsedFee = subscriptionFee ? parseFloat(subscriptionFee) : 0;

    const updated = await prisma.barbershop.update({
      where: { id },
      data: {
        name,
        phone: phone || null,
        subscriptionFee: parsedFee,
        isActive: isActive === true || isActive === 'true',
      },
    });

    return NextResponse.json({ success: true, barbershop: updated });
  } catch (error) {
    console.error('Error updating barbershop:', error);
    return NextResponse.json({ error: 'Erro ao atualizar barbearia' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Because schema.prisma has onDelete: Cascade on almost all barbershop relations,
    // deleting the barbershop will clean up everything (users, customers, appointments, etc).
    await prisma.barbershop.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Barbearia deletada permanentemente' });
  } catch (error) {
    console.error('Error deleting barbershop:', error);
    return NextResponse.json({ error: 'Erro ao deletar barbearia' }, { status: 500 });
  }
}
