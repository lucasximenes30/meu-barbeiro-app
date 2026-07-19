import { prisma } from '@/lib/prisma';
import { Customer, Prisma } from '@prisma/client';

export class ClientRepository {
  async findAll(barbershopId: string): Promise<Customer[]> {
    return prisma.customer.findMany({ 
      where: { barbershopId, deletedAt: null },
      orderBy: { name: 'asc' }
    });
  }

  async findById(id: string, barbershopId: string): Promise<Customer | null> {
    return prisma.customer.findFirst({ 
      where: { id, barbershopId, deletedAt: null } 
    });
  }

  async create(data: Prisma.CustomerUncheckedCreateInput): Promise<Customer> {
    return prisma.customer.create({ data });
  }

  async update(id: string, data: Prisma.CustomerUpdateInput): Promise<Customer> {
    return prisma.customer.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.customer.update({ 
      where: { id }, 
      data: { deletedAt: new Date() } 
    });
  }
}
