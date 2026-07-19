import { prisma } from '@/lib/prisma';
import { Service, Prisma } from '@prisma/client';

export class ServiceRepository {
  async findAll(barbershopId: string): Promise<Service[]> {
    return prisma.service.findMany({ 
      where: { barbershopId, deletedAt: null },
      orderBy: { name: 'asc' }
    });
  }

  async findById(id: string, barbershopId: string): Promise<Service | null> {
    return prisma.service.findFirst({ 
      where: { id, barbershopId, deletedAt: null } 
    });
  }

  async create(data: Prisma.ServiceUncheckedCreateInput): Promise<Service> {
    return prisma.service.create({ data });
  }

  async update(id: string, data: Prisma.ServiceUpdateInput): Promise<Service> {
    return prisma.service.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.service.update({ 
      where: { id }, 
      data: { deletedAt: new Date(), isActive: false } 
    });
  }
}
