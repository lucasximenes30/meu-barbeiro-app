import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response';
import { handleError } from '@/lib/error';
import { BarbershopService } from '@/modules/barbershops/barbershop.service';
import { BarbershopRepository } from '@/modules/barbershops/barbershop.repository';

const service = new BarbershopService(new BarbershopRepository());

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
