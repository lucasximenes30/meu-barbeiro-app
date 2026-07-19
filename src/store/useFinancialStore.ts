import { create } from 'zustand';
import { Transaction } from '@/lib/types';

interface FinancialState {
  transactions: Transaction[];
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
}

export const useFinancialStore = create<FinancialState>((set, get) => ({
  transactions: [],
  isLoading: false,

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/finance');
      const json = await res.json();
      if (json.success) {
        const mapped: Transaction[] = json.data.map((t: any) => {
          let tipo: 'servico' | 'produto' | 'despesa' = 'despesa';
          if (t.type === 'INCOME') {
            if (t.saleId) tipo = 'produto';
            else tipo = 'servico';
          }
          return {
            id: t.id,
            tipo,
            referenciaId: t.appointmentId || t.saleId || '',
            valor: Number(t.amount),
            data: new Date(t.date).toISOString().split('T')[0]
          };
        });
        set({ transactions: mapped });
      }
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaction: async (data) => {
    set({ isLoading: true });
    try {
      let backendType = 'EXPENSE';
      let appointmentId = undefined;
      let saleId = undefined;
      
      if (data.tipo === 'servico') {
        backendType = 'INCOME';
        appointmentId = data.referenciaId;
      } else if (data.tipo === 'produto') {
        backendType = 'INCOME';
        saleId = data.referenciaId;
      }

      const payload = {
        type: backendType,
        amount: data.valor,
        description: data.tipo === 'despesa' ? 'Despesa manual' : 'Receita',
        date: new Date(data.data).toISOString(),
        appointmentId,
        saleId
      };

      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await get().fetchTransactions();
      }
    } catch (error) {
      console.error('Failed to add transaction', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
