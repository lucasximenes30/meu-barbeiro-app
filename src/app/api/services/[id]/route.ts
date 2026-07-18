import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response';
import { handleError } from '@/lib/error';
import { ServiceService } from '@/modules/services/service.service';
import { ServiceRepository } from '@/modules/services/service.repository';

const service = new ServiceService(new ServiceRepository());

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // const item = await service.findById((await params).id);
    return successResponse({ id: (await params).id }, 'Item retrieved successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    // const updated = await service.update((await params).id, body);
    return successResponse({ id: (await params).id, ...body }, 'Updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    // const patched = await service.patch((await params).id, body);
    return successResponse({ id: (await params).id, ...body }, 'Patched successfully');
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // await service.delete((await params).id);
    return successResponse(null, 'Deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}
