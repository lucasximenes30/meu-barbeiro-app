import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response';
import { handleError } from '@/lib/error';
import { ClientService } from '@/modules/clients/client.service';
import { ClientRepository } from '@/modules/clients/client.repository';

const service = new ClientService(new ClientRepository());

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const barbershopId = process.env.DEFAULT_BARBERSHOP_ID || '12345678-1234-1234-1234-123456789012';
    const item = await service.findById((await params).id, barbershopId);
    return successResponse(item, 'Item retrieved successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const updated = await service.update((await params).id, body);
    return successResponse(updated, 'Updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const patched = await service.update((await params).id, body); // using update for patch
    return successResponse(patched, 'Patched successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await service.delete((await params).id);
    return successResponse(null, 'Deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}
