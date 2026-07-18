import { create } from 'zustand';
import { Client } from '@/lib/types';
import { mockClients } from '@/lib/mocks';

interface ClientsState {
  clients: Client[];
  isLoading: boolean;
  fetchClients: () => Promise<void>;
  addClient: (client: Omit<Client, 'id' | 'historico'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const useClientsStore = create<ClientsState>((set) => ({
  clients: mockClients,
  isLoading: false,

  fetchClients: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ isLoading: false });
  },

  addClient: async (data) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newClient: Client = {
      ...data,
      id: Math.random().toString(36).substring(7),
      historico: [],
    };
    set((state) => ({
      clients: [...state.clients, newClient],
      isLoading: false,
    }));
  },

  updateClient: async (id, data) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
      isLoading: false,
    }));
  },

  deleteClient: async (id) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
      isLoading: false,
    }));
  },
}));
