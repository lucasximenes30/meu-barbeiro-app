import { create } from 'zustand';
import { BarbershopSettings } from '@/lib/types';
import { mockSettings } from '@/lib/mocks';

interface SettingsState {
  settings: BarbershopSettings;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<BarbershopSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: mockSettings,
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ isLoading: false });
  },

  updateSettings: async (data) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set((state) => ({
      settings: { ...state.settings, ...data },
      isLoading: false,
    }));
  },
}));
