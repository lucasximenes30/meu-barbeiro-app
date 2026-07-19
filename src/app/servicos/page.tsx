'use client';

import { useServicesStore } from '@/store/useServicesStore';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Scissors, Clock, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function ServicosPage() {
  const { services, fetchServices, isLoading, addService, updateService, deleteService } = useServicesStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    duracaoMinutos: '' as any,
    preco: '' as any,
  });

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleOpenDialog = (servico?: any) => {
    if (servico) {
      setFormData(servico);
    } else {
      setFormData({ id: '', nome: '', duracaoMinutos: '' as any, preco: '' as any });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      preco: Number(formData.preco),
      duracaoMinutos: Number(formData.duracaoMinutos)
    };
    if (payload.id) {
      await updateService(payload.id, payload);
    } else {
      await addService(payload);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      await deleteService(id);
    }
  };

  return (
    <div className="space-y-6 p-4 pt-8">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Serviços</h2>
        <p className="text-muted-foreground text-sm">Gerencie os cortes e serviços da barbearia.</p>
      </div>

      <Button onClick={() => handleOpenDialog()} className="w-full bg-primary text-primary-foreground font-bold h-12 rounded-2xl shadow-[0_0_15px_var(--color-primary)]/20 hover:scale-[1.02] transition-transform">
        <Plus className="mr-2 h-5 w-5" /> Adicionar Novo Serviço
      </Button>

      {/* Services List (Cards) */}
      <div className="space-y-4">
        {isLoading && services.length === 0 ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-white/10 rounded-2xl text-muted-foreground bg-secondary/10">
            Nenhum serviço cadastrado.
          </div>
        ) : (
          services.map((s) => (
            <div key={s.id} className="p-4 rounded-3xl bg-secondary/20 border border-white/5 relative group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Scissors className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-lg leading-tight">{s.nome}</h4>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {s.duracaoMinutos} min
                    </div>
                    <div className="flex items-center gap-1.5 text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded-lg">
                      R$ {s.preco.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(s)} className="flex-1 h-10 rounded-xl bg-white/5 hover:bg-white/10">
                  <Pencil className="h-4 w-4 mr-2" /> Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="flex-1 h-10 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Excluir
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm rounded-3xl glass-card border-white/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">{formData.id ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-5 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="nome" className="text-muted-foreground ml-1">Nome do Serviço</Label>
              <Input
                id="nome"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="h-12 rounded-xl bg-secondary/30 border-white/10"
                placeholder="Ex: Corte Degradê"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duracao" className="text-muted-foreground ml-1">Duração (min)</Label>
                <Input
                  id="duracao"
                  type="number"
                  required
                  value={formData.duracaoMinutos}
                  onChange={(e) => setFormData({ ...formData, duracaoMinutos: e.target.value as any })}
                  className="h-12 rounded-xl bg-secondary/30 border-white/10"
                  placeholder="30"
                />
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
                  placeholder="45.00"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
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
