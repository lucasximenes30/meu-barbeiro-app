import { prisma } from '@/lib/prisma';
import { Product, Prisma } from '@prisma/client';

export class ProductRepository {
  async findAll(barbershopId: string): Promise<Product[]> {
    return prisma.product.findMany({ 
      where: { barbershopId, deletedAt: null },
      orderBy: { name: 'asc' }
    });
  }

  async findById(id: string, barbershopId: string): Promise<Product | null> {
    return prisma.product.findFirst({ 
      where: { id, barbershopId, deletedAt: null } 
    });
  }

  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    return prisma.product.create({ data });
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.update({ 
      where: { id }, 
      data: { deletedAt: new Date(), isActive: false } 
    });
  }
}
