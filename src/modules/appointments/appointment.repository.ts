import { prisma } from '@/lib/prisma';
import { Appointment, Prisma, PaymentMethod } from '@prisma/client';

export class AppointmentRepository {
  async findAll(barbershopId: string): Promise<Appointment[]> {
    return prisma.appointment.findMany({ 
      where: { barbershopId, deletedAt: null },
      orderBy: { date: 'asc' }
    });
  }

  async findById(id: string, barbershopId: string): Promise<Appointment | null> {
    return prisma.appointment.findFirst({ 
      where: { id, barbershopId, deletedAt: null } 
    });
  }

  async create(data: Prisma.AppointmentUncheckedCreateInput): Promise<Appointment> {
    return prisma.appointment.create({ data });
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput): Promise<Appointment> {
    return prisma.appointment.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.appointment.update({ 
      where: { id }, 
      data: { deletedAt: new Date(), status: 'CANCELED' } 
    });
  }

  async finalize(id: string, payments: { method: PaymentMethod; amount: number }[]): Promise<Appointment> {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { service: true }
    });

    if (!appointment) throw new Error('Appointment not found');

    const totalServicePrice = Number(appointment.service.price);
    const totalPayments = payments.reduce((acc, p) => acc + p.amount, 0);

    if (Math.abs(totalServicePrice - totalPayments) > 0.01) {
      throw new Error(`Total payments (${totalPayments}) do not match service price (${totalServicePrice})`);
    }

    // Usar uma transação para garantir que tudo seja salvo em conjunto
    return prisma.$transaction(async (tx) => {
      // 1. Atualizar agendamento para concluído
      const updated = await tx.appointment.update({
        where: { id },
        data: { status: 'COMPLETED' }
      });

      // 2. Criar os registros de Payment
      for (const p of payments) {
        await tx.payment.create({
          data: {
            barbershopId: appointment.barbershopId,
            appointmentId: appointment.id,
            amount: p.amount,
            method: p.method
          }
        });
      }

      // 3. Criar a transação financeira única com o valor total
      await tx.financialTransaction.create({
        data: {
          barbershopId: appointment.barbershopId,
          type: 'INCOME',
          amount: totalServicePrice,
          description: `Atendimento Finalizado: ${appointment.service.name}`,
          appointmentId: appointment.id
        }
      });

      return updated;
    });
  }

  async swap(idA: string, idB: string, barbershopId: string): Promise<void> {
    return prisma.$transaction(async (tx) => {
      const apptA = await tx.appointment.findFirst({ where: { id: idA, barbershopId, deletedAt: null } });
      const apptB = await tx.appointment.findFirst({ where: { id: idB, barbershopId, deletedAt: null } });

      if (!apptA || !apptB) {
        throw new Error('Um ou ambos os agendamentos não foram encontrados.');
      }
      
      if (apptA.status !== 'PENDING' && apptA.status !== 'CONFIRMED') {
         throw new Error(`O agendamento não pode ser substituído pois está com status ${apptA.status}`);
      }
      if (apptB.status !== 'PENDING' && apptB.status !== 'CONFIRMED') {
         throw new Error(`O agendamento não pode ser substituído pois está com status ${apptB.status}`);
      }

      const dateA = apptA.date;
      const dateB = apptB.date;
      const userIdA = apptA.userId;
      const userIdB = apptB.userId;

      await tx.appointment.update({
        where: { id: idA },
        data: { date: dateB, userId: userIdB }
      });

      await tx.appointment.update({
        where: { id: idB },
        data: { date: dateA, userId: userIdA }
      });
    });
  }
}

