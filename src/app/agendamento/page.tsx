'use client';

import Link from 'next/link';

import { useAppointmentsStore } from '@/store/useAppointmentsStore';
import { useClientsStore } from '@/store/useClientsStore';
import { useServicesStore } from '@/store/useServicesStore';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Unlock, Settings, XCircle, MessageCircle } from 'lucide-react';
import { format, addDays, subDays, startOfWeek, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function AgendamentoPage() {
  const { appointments, fetchAppointments, isLoading: isLoadingAppointments, addAppointment } = useAppointmentsStore();
  const { clients, fetchClients } = useClientsStore();
  const { services, fetchServices } = useServicesStore();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [slotToBook, setSlotToBook] = useState<string | null>(null);
  const [formData, setFormData] = useState({ clienteId: '', servicoId: '' });

  const handlePrevMonth = () => setSelectedDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setSelectedDate(prev => addMonths(prev, 1));

  useEffect(() => {
    fetchAppointments();
    fetchClients();
    fetchServices();
  }, [fetchAppointments, fetchClients, fetchServices]);

  const dataFormatada = format(selectedDate, 'yyyy-MM-dd');
  const agendamentosDoDia = appointments.filter((a) => a.data === dataFormatada);

  // Generate the horizontal date scroller
  const startDate = subDays(selectedDate, 2);
  const dateScroller = Array.from({ length: 5 }).map((_, i) => addDays(startDate, i));

  // Generate time slots (9:00 to 18:00 every 30 mins for demo)
  const timeSlots = [];
  for (let h = 9; h <= 18; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
    if (h !== 18) timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
  }

  // Helper to get initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 p-4 pt-8">
      
      {/* Month Header */}
      <div className="flex items-center justify-between px-8 text-primary font-bold">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <span className="capitalize">{format(selectedDate, "MMMM yyyy", { locale: ptBR })}</span>
        <button onClick={handleNextMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Horizontal Date Scroller */}
      <div className="flex justify-between items-center px-1 overflow-x-auto scrollbar-hide gap-2 pb-2">
        {dateScroller.map((date, idx) => {
          const isSelected = format(date, 'yyyy-MM-dd') === dataFormatada;
          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          
          return (
            <div 
              key={idx}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[70px] cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-primary text-primary-foreground shadow-[0_0_15px_var(--color-primary)]/30' 
                  : 'bg-secondary/20 text-muted-foreground border border-white/5'
              }`}
            >
              <span className="text-[10px] uppercase font-medium">{isToday ? 'Hoje' : format(date, 'EEEE', { locale: ptBR }).split('-')[0]}</span>
              <span className={`text-xl font-bold mt-1 ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>{format(date, 'd')}</span>
              <span className="text-[10px] mt-0.5 uppercase">{format(date, 'MMM', { locale: ptBR })}</span>
            </div>
          );
        })}
      </div>

      {/* Info Label */}
      <div className="flex flex-col items-center justify-center gap-2 mt-4 mb-2">
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium hover:text-primary transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Como funcionam os horários?</span>
        </button>
        <div className="flex items-center gap-1.5 text-primary text-sm font-bold">
          R$ {agendamentosDoDia.reduce((acc, curr) => {
            const servico = services.find(s => s.id === curr.servicoId);
            return acc + (servico ? Number(servico.preco) : 0);
          }, 0).toFixed(2).replace('.', ',')}
          <span className="text-muted-foreground text-xs font-medium ml-1">- {agendamentosDoDia.length} itens</span>
        </div>
      </div>

      {/* Daily Body */}
      <div className="bg-secondary/10 rounded-[32px] p-5 border border-white/5 relative mb-6">
        
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold capitalize">{format(selectedDate, "EEEE", { locale: ptBR })}</h3>
            <p className="text-xs text-muted-foreground capitalize">{format(selectedDate, "d 'De' MMMM", { locale: ptBR })}</p>
          </div>
          <Link href="/configuracoes" className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-white/10 transition-colors cursor-pointer">
            <Settings className="w-4 h-4" />
          </Link>
        </div>

        {/* Circle Grid */}
        <div className="grid grid-cols-4 gap-y-6 gap-x-2">
          {timeSlots.map((time, i) => {
            const appt = agendamentosDoDia.find(a => a.hora === time);
            
            // In the future this should check the barber's configuration for blocked times (e.g. lunch)
            const isBlocked = false;
            
            return (
              <div key={i} className="flex flex-col items-center gap-2 relative">
                {appt ? (
                  // Scheduled
                  <div 
                    onClick={() => setSelectedAppointment(appt)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform ${appt.status === 'concluido' ? 'bg-secondary text-foreground' : 'bg-primary text-primary-foreground'}`}
                  >
                    {getInitials(clients.find(c => c.id === appt.clienteId)?.nome || 'CL')}
                  </div>
                ) : isBlocked ? (
                  // Blocked
                  <div className="w-14 h-14 rounded-full bg-secondary/20 border border-white/5 flex items-center justify-center text-muted-foreground/30 cursor-not-allowed">
                    <XCircle className="w-5 h-5 opacity-50" />
                  </div>
                ) : (
                  // Available
                  <div 
                    onClick={() => setSlotToBook(time)}
                    className="w-14 h-14 rounded-full bg-transparent border border-white/10 flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <Unlock className="w-4 h-4 opacity-50" />
                  </div>
                )}
                
                <div className="flex flex-col items-center">
                  <span className={`text-xs font-bold ${appt ? 'text-foreground' : 'text-muted-foreground'}`}>{time}</span>
                  {appt && <span className="text-[9px] text-muted-foreground">{time}</span> /* Duplicated time as per design */}
                </div>
              </div>
            );
          })}
        </div>

      </div>
      
      {/* Help Modal */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="max-w-sm rounded-3xl glass-card">
          <DialogHeader>
            <DialogTitle className="text-xl">Legenda de Horários</DialogTitle>
            <DialogDescription>
              Entenda o significado de cada ícone na sua agenda:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-transparent border border-white/10 flex items-center justify-center text-muted-foreground shrink-0">
                <Unlock className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <span className="font-bold text-foreground">Horário Livre</span>
                <p className="text-muted-foreground text-xs">Disponível para receber agendamentos.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                CL
              </div>
              <div className="text-sm">
                <span className="font-bold text-foreground">Agendado</span>
                <p className="text-muted-foreground text-xs">Cliente com horário reservado (iniciais).</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary/20 border border-white/5 flex items-center justify-center text-muted-foreground/30 shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <span className="font-bold text-foreground">Bloqueado</span>
                <p className="text-muted-foreground text-xs">Horário indisponível (almoço, pausa, etc).</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Appointment Details Modal */}
      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="max-w-sm rounded-3xl glass-card p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-6 mt-2">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shrink-0">
                  {getInitials(clients.find(c => c.id === selectedAppointment.clienteId)?.nome || 'CL')}
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight">
                    {clients.find(c => c.id === selectedAppointment.clienteId)?.nome || 'Cliente Desconhecido'}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-muted-foreground text-sm">
                      {clients.find(c => c.id === selectedAppointment.clienteId)?.telefone || 'Sem telefone'}
                    </p>
                    {clients.find(c => c.id === selectedAppointment.clienteId)?.telefone && (
                      <a 
                        href={`https://wa.me/55${clients.find(c => c.id === selectedAppointment.clienteId)?.telefone?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 px-2 py-0.5 rounded-full transition-colors text-[10px] font-bold tracking-wider"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WHATSAPP
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary/30 rounded-2xl p-4 border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Data e Hora</span>
                  <span className="font-bold text-foreground">
                    {format(new Date(selectedAppointment.data + 'T12:00:00'), 'dd/MM/yyyy')} às {selectedAppointment.hora}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Serviço</span>
                  <span className="font-bold text-foreground">
                    {services.find(s => s.id === selectedAppointment.servicoId)?.nome || 'Não especificado'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Valor</span>
                  <span className="font-bold text-primary text-lg">
                    R$ {Number(services.find(s => s.id === selectedAppointment.servicoId)?.preco || 0).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-colors text-sm"
                >
                  Fechar
                </button>
                <button className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] transition-transform text-sm">
                  Iniciar Corte
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Appointment Modal */}
      <Dialog open={!!slotToBook} onOpenChange={(open) => {
        if (!open) {
          setSlotToBook(null);
          setFormData({ clienteId: '', servicoId: '' });
        }
      }}>
        <DialogContent className="max-w-sm rounded-3xl glass-card p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Novo Agendamento</DialogTitle>
            <DialogDescription>
              Marcando horário para {format(selectedDate, 'dd/MM/yyyy')} às {slotToBook}
            </DialogDescription>
          </DialogHeader>
          
          <form className="space-y-4 mt-2" onSubmit={async (e) => {
            e.preventDefault();
            if (slotToBook && formData.clienteId && formData.servicoId) {
              await addAppointment({
                clienteId: formData.clienteId,
                servicoId: formData.servicoId,
                data: format(selectedDate, 'yyyy-MM-dd'),
                hora: slotToBook,
                status: 'confirmado'
              });
              setSlotToBook(null);
              setFormData({ clienteId: '', servicoId: '' });
            }
          }}>
            <div className="grid gap-2">
              <Label className="text-muted-foreground ml-1">Cliente</Label>
              <select 
                required
                className="h-12 w-full rounded-xl bg-secondary/30 border-white/10 px-3 text-sm text-foreground focus:ring-primary focus:border-primary"
                value={formData.clienteId}
                onChange={e => setFormData({ ...formData, clienteId: e.target.value })}
              >
                <option value="" disabled className="bg-background text-muted-foreground">Selecione o cliente</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id} className="bg-background">{c.nome} ({c.telefone})</option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label className="text-muted-foreground ml-1">Serviço</Label>
              <select 
                required
                className="h-12 w-full rounded-xl bg-secondary/30 border-white/10 px-3 text-sm text-foreground focus:ring-primary focus:border-primary"
                value={formData.servicoId}
                onChange={e => setFormData({ ...formData, servicoId: e.target.value })}
              >
                <option value="" disabled className="bg-background text-muted-foreground">Selecione o serviço</option>
                {services.map(s => (
                  <option key={s.id} value={s.id} className="bg-background">{s.nome} - R$ {Number(s.preco).toFixed(2).replace('.', ',')}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="button"
                onClick={() => setSlotToBook(null)}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-colors text-sm"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isLoadingAppointments}
                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] transition-transform text-sm disabled:opacity-50"
              >
                {isLoadingAppointments ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
