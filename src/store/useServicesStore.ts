import { create } from 'zustand';
import { Service } from '@/lib/types';

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  fetchServices: () => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  isLoading: false,

  fetchServices: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/services');
      const json = await res.json();
      if (json.success) {
        // Map Prisma Service to Frontend Service
        const mapped: Service[] = json.data.map((s: any) => ({
          id: s.id,
          nome: s.name,
          duracaoMinutos: s.duration,
          preco: Number(s.price)
        }));
        set({ services: mapped });
      }
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addService: async (data) => {
    set({ isLoading: true });
    try {
      const payload = {
        name: data.nome,
        duration: data.duracaoMinutos,
        price: data.preco
      };
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await get().fetchServices();
      }
    } catch (error) {
      console.error('Failed to add service', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateService: async (id, data) => {
    set({ isLoading: true });
    try {
      const payload: any = {};
      if (data.nome) payload.name = data.nome;
      if (data.duracaoMinutos) payload.duration = data.duracaoMinutos;
      if (data.preco !== undefined) payload.price = data.preco;
      
      const res = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await get().fetchServices();
      }
    } catch (error) {
      console.error('Failed to update service', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteService: async (id) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await get().fetchServices();
      }
    } catch (error) {
      console.error('Failed to delete service', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
