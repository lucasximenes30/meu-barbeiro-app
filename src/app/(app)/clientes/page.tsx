'use client';

import { useClientsStore } from '@/store/useClientsStore';
import { useAppointmentsStore } from '@/store/useAppointmentsStore';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Phone, History, User, Users } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

export default function ClientesPage() {
  const { clients, fetchClients, addClient, updateClient, isLoading } = useClientsStore();
  const { appointments, fetchAppointments } = useAppointmentsStore();
  const [busca, setBusca] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    telefone: '',
  });

  useEffect(() => {
    fetchClients();
    fetchAppointments();
  }, [fetchClients, fetchAppointments]);

  const clientesFiltrados = clients.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) || 
    c.telefone.includes(busca)
  );

  const handleOpenDialog = (cliente?: any) => {
    if (cliente) {
      setFormData({ id: cliente.id, nome: cliente.nome, telefone: cliente.telefone });
    } else {
      setFormData({ id: '', nome: '', telefone: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      await updateClient(formData.id, formData);
    } else {
      await addClient(formData);
    }
    setIsDialogOpen(false);
  };

  const handleOpenHistory = (cliente: any) => {
    setSelectedClient(cliente);
    setIsHistoryOpen(true);
  };

  const getClientAppointments = (clientId: string) => {
    return appointments
      .filter(a => a.clienteId === clientId)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Clientes</h2>
          <p className="text-muted-foreground">Gerencie o cadastro e histórico de seus clientes.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou telefone..."
            className="pl-8"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Última Visita</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && clients.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><div className="h-4 bg-zinc-800/50 rounded w-32 animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 bg-zinc-800/50 rounded w-24 animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 bg-zinc-800/50 rounded w-28 animate-pulse" /></TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <div className="h-8 bg-zinc-800/50 rounded w-20 animate-pulse" />
                    <div className="h-8 bg-zinc-800/50 rounded w-16 animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : clientesFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-0 border-b-0">
                  <EmptyState 
                    icon={Users}
                    title="Nenhum cliente por aqui"
                    description={busca ? "Não encontramos nenhum cliente com esse termo de busca." : "Você ainda não possui clientes cadastrados. Adicione o seu primeiro cliente agora mesmo."}
                    actionLabel={busca ? undefined : "Cadastrar Cliente"}
                    onAction={busca ? undefined : () => handleOpenDialog()}
                  />
                </TableCell>
              </TableRow>
            ) : (
              clientesFiltrados.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {c.nome}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {c.telefone}
                    </div>
                  </TableCell>
                  <TableCell>
                    {c.ultimaVisita 
                      ? format(parseISO(c.ultimaVisita), "dd 'de' MMM, yyyy", { locale: ptBR }) 
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenHistory(c)}>
                      <History className="h-4 w-4 mr-2" /> Histórico
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(c)}>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Cadastro/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefone">Telefone / WhatsApp</Label>
              <Input
                id="telefone"
                required
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Histórico */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Histórico de Agendamentos</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Cliente: <span className="font-semibold text-foreground">{selectedClient?.nome}</span>
            </p>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            {selectedClient && getClientAppointments(selectedClient.id).length > 0 ? (
              <div className="border rounded-md divide-y">
                {getClientAppointments(selectedClient.id).map(app => (
                  <div key={app.id} className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{format(new Date(app.data), "dd/MM/yyyy")} às {app.hora}</div>
                    </div>
                    <Badge variant={app.status === 'concluido' ? 'default' : 'secondary'}>
                      {app.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border rounded-md border-dashed">
                Nenhum agendamento encontrado para este cliente.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
