import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response';
import { handleError } from '@/lib/error';
import { ServiceService } from '@/modules/services/service.service';
import { ServiceRepository } from '@/modules/services/service.repository';

const service = new ServiceService(new ServiceRepository());

export async function GET(req: NextRequest) {
  try {
    const barbershopId = process.env.DEFAULT_BARBERSHOP_ID || '12345678-1234-1234-1234-123456789012';
    const items = await service.findAll(barbershopId);
    return successResponse(items, 'List retrieved successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const barbershopId = process.env.DEFAULT_BARBERSHOP_ID || '12345678-1234-1234-1234-123456789012';
    const created = await service.create({ ...body, barbershopId });
    return successResponse(created, 'Created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}
