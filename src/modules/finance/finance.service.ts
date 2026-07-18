import { FinanceRepository } from './finance.repository';

export class FinanceService {
  constructor(private readonly repository: FinanceRepository) {}
}
