import { AppointmentRepository } from './appointment.repository';

export class AppointmentService {
  constructor(private readonly repository: AppointmentRepository) {}
}
