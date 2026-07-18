import { BarbershopRepository } from './barbershop.repository';

export class BarbershopService {
  constructor(private readonly repository: BarbershopRepository) {}
}
