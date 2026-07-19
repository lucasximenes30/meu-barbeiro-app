import { ProductRepository } from './product.repository';
import { Prisma } from '@prisma/client';

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async findAll(barbershopId: string) {
    return this.repository.findAll(barbershopId);
  }

  async findById(id: string, barbershopId: string) {
    return this.repository.findById(id, barbershopId);
  }

  async create(data: Prisma.ProductUncheckedCreateInput) {
    return this.repository.create(data);
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
