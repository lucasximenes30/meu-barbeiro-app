'use client';

import { useAppointmentsStore } from '@/store/useAppointmentsStore';
import { useClientsStore } from '@/store/useClientsStore';
import { useServicesStore } from '@/store/useServicesStore';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Calendar as CalendarIcon, Clock, User, Scissors } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function AgendamentoPage() {
  const { appointments, fetchAppointments, addAppointment, updateAppointment, isLoading } = useAppointmentsStore();
  const { clients, fetchClients } = useClientsStore();
  const { services, fetchServices } = useServicesStore();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    clienteId: '',
    servicoId: '',
    data: format(new Date(), 'yyyy-MM-dd'),
    hora: '',
    status: 'confirmado' as any,
  });

  useEffect(() => {
    fetchAppointments();
    fetchClients();
    fetchServices();
  }, [fetchAppointments, fetchClients, fetchServices]);

  const dataFormatada = date ? format(date, 'yyyy-MM-dd') : '';
  const agendamentosDoDia = appointments
    .filter((a) => a.data === dataFormatada)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const handleOpenDialog = (agendamento?: any) => {
    if (agendamento) {
      setFormData(agendamento);
    } else {
      setFormData({
        id: '',
        clienteId: '',
        servicoId: '',
        data: dataFormatada,
        hora: '09:00',
        status: 'confirmado',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      await updateAppointment(formData.id, formData);
    } else {
      await addAppointment(formData);
    }
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'concluido': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelado': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'nao_compareceu': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Agenda</h2>
          <p className="text-muted-foreground">Gerencie seus horários e clientes.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {/* Calendário Lateral */}
        <div className="md:w-[300px] flex-shrink-0">
          <div className="border rounded-md p-3 bg-card">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              className="w-full"
            />
          </div>
        </div>

        {/* Lista de Agendamentos */}
        <div className="flex-1 border rounded-md bg-card overflow-y-auto p-4">
          <h3 className="font-semibold text-lg mb-4 flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
            {date ? format(date, "EEEE, d 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
          </h3>
          
          <div className="space-y-3">
            {isLoading && agendamentosDoDia.length === 0 ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : agendamentosDoDia.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                Nenhum agendamento para este dia.
              </div>
            ) : (
              agendamentosDoDia.map((app) => {
                const cliente = clients.find((c) => c.id === app.clienteId);
                const servico = services.find((s) => s.id === app.servicoId);
                
                return (
                  <div
                    key={app.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer group"
                    onClick={() => handleOpenDialog(app)}
                  >
                    <div className="flex items-start md:items-center gap-4">
                      <div className="flex flex-col items-center justify-center bg-secondary/50 rounded-md p-2 min-w-[70px]">
                        <Clock className="h-4 w-4 mb-1 text-primary" />
                        <span className="font-bold text-lg leading-none">{app.hora}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-lg">{cliente?.nome || 'Cliente não encontrado'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Scissors className="h-3 w-3" />
                          <span>{servico?.nome || 'Serviço não encontrado'}</span>
                          <span>•</span>
                          <span>{servico?.duracaoMinutos} min</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                      <Badge variant="outline" className={getStatusColor(app.status)}>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Select
                value={formData.clienteId}
                onValueChange={(val) => setFormData({ ...formData, clienteId: val || '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="servico">Serviço</Label>
              <Select
                value={formData.servicoId}
                onValueChange={(val) => setFormData({ ...formData, servicoId: val || '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.nome} - R$ {s.preco.toFixed(2)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  required
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hora">Horário</Label>
                <Input
                  id="hora"
                  type="time"
                  required
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val: any) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="nao_compareceu">Não Compareceu</SelectItem>
                </SelectContent>
              </Select>
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
    </div>
  );
}
