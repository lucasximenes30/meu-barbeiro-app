import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response';
import { handleError } from '@/lib/error';
import { AppointmentService } from '@/modules/appointments/appointment.service';
import { AppointmentRepository } from '@/modules/appointments/appointment.repository';

const service = new AppointmentService(new AppointmentRepository());

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
