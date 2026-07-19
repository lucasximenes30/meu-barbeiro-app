import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response';
import { handleError } from '@/lib/error';
import { AppointmentService } from '@/modules/appointments/appointment.service';
import { AppointmentRepository } from '@/modules/appointments/appointment.repository';
import { prisma } from '@/lib/prisma';
import { getAuthBarbershopId } from '@/lib/auth-server';

const service = new AppointmentService(new AppointmentRepository());

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
    
    // We need a userId since frontend doesn't send it
    const defaultUser = await prisma.user.findFirst({ where: { barbershopId } });
    if (!defaultUser) throw new Error("No default user found in shop");

    const created = await service.create({ 
      ...body, 
      barbershopId,
      userId: defaultUser.id 
    });
    return successResponse(created, 'Created successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}
