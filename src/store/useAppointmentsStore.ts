import { create } from 'zustand';
import { Appointment } from '@/lib/types';

interface AppointmentsState {
  appointments: Appointment[];
  isLoading: boolean;
  fetchAppointments: () => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}

const mapStatusToFrontend = (status: string): Appointment['status'] => {
  switch(status) {
    case 'COMPLETED': return 'concluido';
    case 'CANCELED': return 'cancelado';
    case 'NO_SHOW': return 'nao_compareceu';
    default: return 'confirmado'; // maps CONFIRMED and PENDING
  }
};

const mapStatusToBackend = (status?: string): string | undefined => {
  if (!status) return undefined;
  switch(status) {
    case 'concluido': return 'COMPLETED';
    case 'cancelado': return 'CANCELED';
    case 'nao_compareceu': return 'NO_SHOW';
    case 'confirmado': return 'CONFIRMED';
    default: return 'PENDING';
  }
};

export const useAppointmentsStore = create<AppointmentsState>((set, get) => ({
  appointments: [],
  isLoading: false,

  fetchAppointments: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/appointments');
      const json = await res.json();
      if (json.success) {
        const mapped: Appointment[] = json.data.map((a: any) => {
          const dateObj = new Date(a.date);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          return {
            id: a.id,
            clienteId: a.customerId,
            servicoId: a.serviceId,
            data: `${year}-${month}-${day}`,
            hora: dateObj.toTimeString().split(' ')[0].substring(0, 5),
            status: mapStatusToFrontend(a.status),
            observacoes: a.notes || undefined
          };
        });
        set({ appointments: mapped });
      }
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addAppointment: async (data) => {
    set({ isLoading: true });
    try {
      // Create valid date string from data + hora (assuming local timezone or UTC)
      // "2023-01-01" + "14:00" -> "2023-01-01T14:00:00.000Z" (We'll just send standard ISO string)
      const dateTime = new Date(`${data.data}T${data.hora}:00`).toISOString();
      
      const payload = {
        customerId: data.clienteId,
        serviceId: data.servicoId,
        date: dateTime,
        status: mapStatusToBackend(data.status) || 'CONFIRMED',
        notes: data.observacoes
      };
      
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await get().fetchAppointments();
      }
    } catch (error) {
      console.error('Failed to add appointment', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateAppointment: async (id, data) => {
    set({ isLoading: true });
    try {
      const payload: any = {};
      if (data.clienteId) payload.customerId = data.clienteId;
      if (data.servicoId) payload.serviceId = data.servicoId;
      
      if (data.data || data.hora) {
        // Find existing to merge date and time if only one is updated
        const current = get().appointments.find(a => a.id === id);
        if (current) {
          const d = data.data || current.data;
          const h = data.hora || current.hora;
          payload.date = new Date(`${d}T${h}:00`).toISOString();
        }
      }
      
      if (data.status) payload.status = mapStatusToBackend(data.status);
      if (data.observacoes !== undefined) payload.notes = data.observacoes;
      
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await get().fetchAppointments();
      }
    } catch (error) {
      console.error('Failed to update appointment', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAppointment: async (id) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await get().fetchAppointments();
      }
    } catch (error) {
      console.error('Failed to delete appointment', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
