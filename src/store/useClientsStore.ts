import { create } from 'zustand';
import { Client } from '@/lib/types';

interface ClientsState {
  clients: Client[];
  isLoading: boolean;
  fetchClients: () => Promise<void>;
  addClient: (client: Omit<Client, 'id' | 'historico'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const useClientsStore = create<ClientsState>((set, get) => ({
  clients: [],
  isLoading: false,

  fetchClients: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/clients');
      const json = await res.json();
      if (json.success) {
        // Map Prisma Customer to Frontend Client
        const mapped: Client[] = json.data.map((c: any) => ({
          id: c.id,
          nome: c.name,
          telefone: c.phone || '',
          ultimaVisita: c.updatedAt,
          historico: []
        }));
        set({ clients: mapped });
      }
    } catch (error) {
      console.error('Failed to fetch clients', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addClient: async (data) => {
    set({ isLoading: true });
    try {
      const payload = {
        name: data.nome,
        phone: data.telefone
      };
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await get().fetchClients();
      }
    } catch (error) {
      console.error('Failed to add client', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateClient: async (id, data) => {
    set({ isLoading: true });
    try {
      const payload: any = {};
      if (data.nome) payload.name = data.nome;
      if (data.telefone) payload.phone = data.telefone;
      
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await get().fetchClients();
      }
    } catch (error) {
      console.error('Failed to update client', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteClient: async (id) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await get().fetchClients();
      }
    } catch (error) {
      console.error('Failed to delete client', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
