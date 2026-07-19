import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const barbershopId = (await params).slug;
    const body = await req.json();
    const { action, phone, appointmentId } = body;

    if (action === 'LIST') {
      const appointments = await prisma.appointment.findMany({
        where: {
          barbershopId,
          customer: { phone },
          status: 'PENDING',
          date: { gte: new Date() }
        },
        include: { service: true }
      });

      const list = appointments.map(a => ({
        id: a.id,
        label: `${format(new Date(a.date), 'dd/MM HH:mm')} - ${a.service.name}`
      }));
      return NextResponse.json({ success: true, appointments: list });
    }

    if (action === 'CANCEL') {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CANCELED' }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('Cancel API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
