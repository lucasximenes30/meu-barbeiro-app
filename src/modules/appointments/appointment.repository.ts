import { prisma } from '@/lib/prisma';
import { Appointment, Prisma } from '@prisma/client';

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
}
