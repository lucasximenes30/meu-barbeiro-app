import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response';
import { handleError } from '@/lib/error';
import { AppointmentService } from '@/modules/appointments/appointment.service';
import { AppointmentRepository } from '@/modules/appointments/appointment.repository';
import { getAuthBarbershopId } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

const service = new AppointmentService(new AppointmentRepository());

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const barbershopId = await getAuthBarbershopId(req);
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
    const id = (await params).id;
    const patched = await service.update(id, body);
    
    // Se foi cancelado, remover a transação financeira para não contar na receita
    if (body.status === 'CANCELED') {
      await prisma.financialTransaction.deleteMany({
        where: { appointmentId: id }
      });
    }

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
