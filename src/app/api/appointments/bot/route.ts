import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { barbershopId, nome, email, telefone, servicoId, data: appointmentDate, hora } = data;

    if (!barbershopId || !nome || !servicoId || !appointmentDate || !hora) {
      return errorResponse('Missing required fields', 400);
    }

    // 1. Encontrar ou criar cliente
    // Idealmente, a busca seria por telefone ou e-mail, vamos buscar por email como exemplo.
    let customer = await prisma.customer.findFirst({
      where: {
        barbershopId,
        email: email || undefined
      }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          barbershopId,
          name: nome,
          email: email || null,
          phone: telefone || null,
        }
      });
    }

    // 2. Pegar o default user do barbershop (para associar o agendamento ao barbeiro principal)
    // Se a barbearia tiver mais barbeiros, o chat deveria perguntar, mas por padrão pegamos o primeiro.
    const defaultUser = await prisma.user.findFirst({
      where: { barbershopId }
    });

    if (!defaultUser) {
      return errorResponse('No barber found in shop', 400);
    }

    // Combinar data (YYYY-MM-DD) e hora (HH:MM)
    const datetimeStr = `${appointmentDate}T${hora}:00`;
    const fullDate = new Date(datetimeStr);

    // 3. Criar o Agendamento
    const newAppointment = await prisma.appointment.create({
      data: {
        barbershopId,
        customerId: customer.id,
        userId: defaultUser.id,
        serviceId: servicoId,
        date: fullDate,
        status: 'CONFIRMED',
        notes: `Agendado via Assistente Virtual. Hora original: ${hora}`,
      }
    });

    return successResponse(newAppointment, 'Appointment created', 201);
  } catch (error: any) {
    console.error('Error creating appointment via bot:', error);
    return errorResponse(error.message, null, 500);
  }
}
