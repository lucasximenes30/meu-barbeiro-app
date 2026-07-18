import { create } from 'zustand';
import { Appointment } from '@/lib/types';
import { mockAppointments } from '@/lib/mocks';

interface AppointmentsState {
  appointments: Appointment[];
  isLoading: boolean;
  fetchAppointments: () => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
  appointments: mockAppointments,
  isLoading: false,

  fetchAppointments: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ isLoading: false });
  },

  addAppointment: async (data) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newApp: Appointment = {
      ...data,
      id: Math.random().toString(36).substring(7),
    };
    set((state) => ({
      appointments: [...state.appointments, newApp],
      isLoading: false,
    }));
  },

  updateAppointment: async (id, data) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...data } : a)),
      isLoading: false,
    }));
  },

  deleteAppointment: async (id) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
      isLoading: false,
    }));
  },
}));
