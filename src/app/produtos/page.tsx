'use client';

import { useProductsStore } from '@/store/useProductsStore';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Search, AlertCircle, PackageOpen, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function ProdutosPage() {
  const { products, fetchProducts, isLoading, addProduct, updateProduct, deleteProduct } =
    useProductsStore();
  const [busca, setBusca] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    descricao: '',
    imagemUrl: '',
    preco: '' as any,
    categoria: '',
    estoque: '' as any,
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const produtosFiltrados = products.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const handleOpenDialog = (produto?: any) => {
    if (produto) {
      setFormData({
        id: produto.id || '',
        nome: produto.nome || '',
        descricao: produto.descricao || '',
        imagemUrl: produto.imagemUrl || '',
        preco: produto.preco || '',
        categoria: produto.categoria || '',
        estoque: produto.estoque || ''
      });
    } else {
      setFormData({ id: '', nome: '', descricao: '', imagemUrl: '', preco: '' as any, categoria: '', estoque: '' as any });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      preco: Number(formData.preco),
      estoque: Number(formData.estoque)
    };
    if (payload.id) {
      await updateProduct(payload.id, payload);
    } else {
      await addProduct(payload);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6 p-4 pt-8">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Produtos</h2>
        <p className="text-muted-foreground text-sm">Gerencie o estoque para venda física.</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            className="pl-10 h-12 rounded-2xl bg-secondary/20 border-white/10"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenDialog()} className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground shadow-[0_0_15px_var(--color-primary)]/20 p-0 flex shrink-0 items-center justify-center">
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Products Grid (Cards) */}
      <div className="grid grid-cols-2 gap-3">
        {isLoading && products.length === 0 ? (
          <div className="col-span-2 flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="col-span-2 text-center p-8 border border-dashed border-white/10 rounded-2xl text-muted-foreground bg-secondary/10">
            Nenhum produto encontrado.
          </div>
        ) : (
          produtosFiltrados.map((p) => (
            <div key={p.id} className="p-3 rounded-3xl bg-secondary/20 border border-white/5 flex flex-col justify-between group h-full relative overflow-hidden">
              <div>
                <div className="w-full aspect-square rounded-2xl bg-secondary/30 mb-3 flex items-center justify-center relative overflow-hidden">
                  {p.imagemUrl ? (
                    <img src={p.imagemUrl} alt={p.nome} className="w-full h-full object-cover" />
                  ) : (
                    <PackageOpen className="w-8 h-8 text-muted-foreground/30" />
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    {p.estoque === 0 ? (
                      <span className="bg-destructive text-destructive-foreground text-[9px] font-bold px-2 py-0.5 rounded-full">ESGOTADO</span>
                    ) : p.estoque <= 5 ? (
                      <span className="bg-yellow-500/20 text-yellow-500 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-2 h-2" /> BAIXO
                      </span>
                    ) : (
                      <span className="bg-primary/20 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {p.estoque} UN
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                  <Tag className="w-3 h-3" />
                  {p.categoria}
                </div>
                
                <h4 className="font-extrabold text-base text-foreground leading-tight line-clamp-2 mb-1">{p.nome}</h4>
                <div className="text-primary font-black text-lg">
                  R$ {p.preco.toFixed(2).replace('.', ',')}
                </div>
              </div>
              
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/5">
                <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(p)} className="flex-1 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-xs px-0">
                  <Pencil className="h-3 w-3 mr-1" /> Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive px-0 shrink-0">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm rounded-3xl glass-card border-white/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">{formData.id ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="nome" className="text-muted-foreground ml-1">Nome do Produto</Label>
              <Input
                id="nome"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="h-12 rounded-xl bg-secondary/30 border-white/10"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imagemFile" className="text-muted-foreground ml-1">Foto do Produto (Galeria/Câmera)</Label>
              <Input
                id="imagemFile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({ ...formData, imagemUrl: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="h-12 rounded-xl bg-secondary/30 border-white/10 file:bg-primary file:text-primary-foreground file:border-0 file:rounded-lg file:px-4 file:py-1 file:mr-3 file:h-full file:cursor-pointer cursor-pointer text-muted-foreground"
              />
              {/* Image Preview */}
              {formData.imagemUrl && (
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <img src={formData.imagemUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs text-green-500 font-medium">Foto anexada!</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="categoria" className="text-muted-foreground ml-1">Categoria</Label>
                <Input
                  id="categoria"
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="h-12 rounded-xl bg-secondary/30 border-white/10"
                  placeholder="Ex: Pomada"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estoque" className="text-muted-foreground ml-1">Estoque</Label>
                <Input
                  id="estoque"
                  type="number"
                  required
                  value={formData.estoque}
                  onChange={(e) => setFormData({ ...formData, estoque: e.target.value as any })}
                  className="h-12 rounded-xl bg-secondary/30 border-white/10"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="preco" className="text-muted-foreground ml-1">Preço (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                required
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: e.target.value as any })}
                className="h-12 rounded-xl bg-secondary/30 border-white/10"
                placeholder="0.00"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-2 mt-2">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-xl">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl bg-primary text-primary-foreground font-bold">
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
