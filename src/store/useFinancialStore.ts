import { create } from 'zustand';
import { Transaction } from '@/lib/types';
import { mockTransactions } from '@/lib/mocks';

interface FinancialState {
  transactions: Transaction[];
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
}

export const useFinancialStore = create<FinancialState>((set) => ({
  transactions: mockTransactions,
  isLoading: false,

  fetchTransactions: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ isLoading: false });
  },

  addTransaction: async (data) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newTx: Transaction = {
      ...data,
      id: Math.random().toString(36).substring(7),
    };
    set((state) => ({
      transactions: [...state.transactions, newTx],
      isLoading: false,
    }));
  },
}));
