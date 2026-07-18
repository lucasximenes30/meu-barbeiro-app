import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response';
import { handleError } from '@/lib/error';
import { ProductService } from '@/modules/products/product.service';
import { ProductRepository } from '@/modules/products/product.repository';

const service = new ProductService(new ProductRepository());

export async function GET(req: NextRequest) {
  try {
    // const items = await service.findAll();
    return successResponse([], 'List retrieved successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // const created = await service.create(body);
    return successResponse({}, 'Created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}
