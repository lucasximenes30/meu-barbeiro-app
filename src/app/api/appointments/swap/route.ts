import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response';
import { handleError } from '@/lib/error';
import { AppointmentService } from '@/modules/appointments/appointment.service';
import { AppointmentRepository } from '@/modules/appointments/appointment.repository';
import { getAuthBarbershopId } from '@/lib/auth-server';

const service = new AppointmentService(new AppointmentRepository());

export async function POST(req: NextRequest) {
  try {
    const barbershopId = await getAuthBarbershopId(req);
    const body = await req.json();
    
    if (!body.idA || !body.idB) {
      throw new Error('IDs dos agendamentos não fornecidos.');
    }

    await service.swap(body.idA, body.idB, barbershopId);
    
    return successResponse(null, 'Horários substituídos com sucesso.');
  } catch (error) {
    return handleError(error);
  }
}
