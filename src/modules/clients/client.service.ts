import { ClientRepository } from './client.repository';
import { Prisma } from '@prisma/client';

export class ClientService {
  constructor(private readonly repository: ClientRepository) {}

  async findAll(barbershopId: string) {
    return this.repository.findAll(barbershopId);
  }

  async findById(id: string, barbershopId: string) {
    return this.repository.findById(id, barbershopId);
  }

  async create(data: Prisma.CustomerUncheckedCreateInput) {
    return this.repository.create(data);
  }

  async update(id: string, data: Prisma.CustomerUpdateInput) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
