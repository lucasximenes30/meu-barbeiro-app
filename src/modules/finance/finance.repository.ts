import { prisma } from '@/lib/prisma';
import { FinancialTransaction, Prisma } from '@prisma/client';

export class FinanceRepository {
  async findAll(barbershopId: string): Promise<FinancialTransaction[]> {
    return prisma.financialTransaction.findMany({ 
      where: { barbershopId, deletedAt: null },
      orderBy: { date: 'desc' }
    });
  }

  async findById(id: string, barbershopId: string): Promise<FinancialTransaction | null> {
    return prisma.financialTransaction.findFirst({ 
      where: { id, barbershopId, deletedAt: null } 
    });
  }

  async create(data: Prisma.FinancialTransactionUncheckedCreateInput): Promise<FinancialTransaction> {
    return prisma.financialTransaction.create({ data });
  }

  async update(id: string, data: Prisma.FinancialTransactionUpdateInput): Promise<FinancialTransaction> {
    return prisma.financialTransaction.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.financialTransaction.update({ 
      where: { id }, 
      data: { deletedAt: new Date() } 
    });
  }
}
