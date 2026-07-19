import { ServiceRepository } from './service.repository';
import { Prisma } from '@prisma/client';

export class ServiceService {
  constructor(private readonly repository: ServiceRepository) {}

  async findAll(barbershopId: string) {
    return this.repository.findAll(barbershopId);
  }

  async findById(id: string, barbershopId: string) {
    return this.repository.findById(id, barbershopId);
  }

  async create(data: Prisma.ServiceUncheckedCreateInput) {
    return this.repository.create(data);
  }

  async update(id: string, data: Prisma.ServiceUpdateInput) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
