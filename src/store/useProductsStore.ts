import { create } from 'zustand';
import { Product } from '@/lib/types';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success) {
        // Map Prisma Product to Frontend Product
        const mapped: Product[] = json.data.map((p: any) => ({
          id: p.id,
          nome: p.name,
          descricao: p.description || '',
          preco: Number(p.price),
          categoria: 'Geral', // Not in Prisma yet
          estoque: p.stock,
          imagemUrl: p.imageUrl || undefined
        }));
        set({ products: mapped });
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (data) => {
    set({ isLoading: true });
    try {
      const payload = {
        name: data.nome,
        description: data.descricao,
        imageUrl: data.imagemUrl,
        price: data.preco,
        stock: data.estoque
      };
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await get().fetchProducts();
      }
    } catch (error) {
      console.error('Failed to add product', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, data) => {
    set({ isLoading: true });
    try {
      const payload: any = {};
      if (data.nome) payload.name = data.nome;
      if (data.descricao !== undefined) payload.description = data.descricao;
      if (data.imagemUrl !== undefined) payload.imageUrl = data.imagemUrl;
      if (data.preco !== undefined) payload.price = data.preco;
      if (data.estoque !== undefined) payload.stock = data.estoque;
      
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await get().fetchProducts();
      }
    } catch (error) {
      console.error('Failed to update product', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await get().fetchProducts();
      }
    } catch (error) {
      console.error('Failed to delete product', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
