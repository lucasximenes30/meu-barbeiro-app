import { FinanceRepository } from './finance.repository';
import { Prisma } from '@prisma/client';

export class FinanceService {
  constructor(private readonly repository: FinanceRepository) {}

  async findAll(barbershopId: string) {
    return this.repository.findAll(barbershopId);
  }

  async findById(id: string, barbershopId: string) {
    return this.repository.findById(id, barbershopId);
  }

  async create(data: Prisma.FinancialTransactionUncheckedCreateInput) {
    return this.repository.create(data);
  }

  async update(id: string, data: Prisma.FinancialTransactionUpdateInput) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
