import { AppointmentRepository } from './appointment.repository';
import { Prisma } from '@prisma/client';

export class AppointmentService {
  constructor(private readonly repository: AppointmentRepository) {}

  async findAll(barbershopId: string) {
    return this.repository.findAll(barbershopId);
  }

  async findById(id: string, barbershopId: string) {
    return this.repository.findById(id, barbershopId);
  }

  async create(data: Prisma.AppointmentUncheckedCreateInput) {
    return this.repository.create(data);
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }

  async finalize(id: string, payments: { method: any; amount: number }[]) {
    return this.repository.finalize(id, payments);
  }

  async swap(idA: string, idB: string, barbershopId: string) {
    return this.repository.swap(idA, idB, barbershopId);
  }
}

