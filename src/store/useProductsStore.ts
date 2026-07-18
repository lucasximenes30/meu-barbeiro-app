import { create } from 'zustand';
import { Product } from '@/lib/types';
import { mockProducts } from '@/lib/mocks';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: mockProducts,
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    // Simulando chamada de API
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ isLoading: false }); // Mantém os mocks para não resetar se houver alterações
  },

  addProduct: async (productData) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substring(7),
    };
    
    set((state) => ({
      products: [...state.products, newProduct],
      isLoading: false,
    }));
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...productData } : p)),
      isLoading: false,
    }));
  },

  deleteProduct: async (id) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      isLoading: false,
    }));
  },
}));
