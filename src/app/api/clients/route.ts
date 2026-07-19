import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response';
import { handleError } from '@/lib/error';
import { ClientService } from '@/modules/clients/client.service';
import { ClientRepository } from '@/modules/clients/client.repository';
import { getAuthBarbershopId } from '@/lib/auth-server';

const service = new ClientService(new ClientRepository());

export async function GET(req: NextRequest) {
  try {
    const barbershopId = await getAuthBarbershopId(req);
    const items = await service.findAll(barbershopId);
    return successResponse(items, 'List retrieved successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const barbershopId = await getAuthBarbershopId(req);
    const created = await service.create({ ...body, barbershopId });
    return successResponse(created, 'Created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}
