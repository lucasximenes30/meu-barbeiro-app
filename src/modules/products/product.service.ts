import { ProductRepository } from './product.repository';

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}
}
