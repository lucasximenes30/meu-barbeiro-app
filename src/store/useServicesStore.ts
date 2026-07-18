import { create } from 'zustand';
import { Service } from '@/lib/types';
import { mockServices } from '@/lib/mocks';

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  fetchServices: () => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export const useServicesStore = create<ServicesState>((set) => ({
  services: mockServices,
  isLoading: false,

  fetchServices: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ isLoading: false });
  },

  addService: async (data) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newService: Service = {
      ...data,
      id: Math.random().toString(36).substring(7),
    };
    set((state) => ({
      services: [...state.services, newService],
      isLoading: false,
    }));
  },

  updateService: async (id, data) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, ...data } : s)),
      isLoading: false,
    }));
  },

  deleteService: async (id) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
      isLoading: false,
    }));
  },
}));
