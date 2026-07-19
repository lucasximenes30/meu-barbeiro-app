'use client';

import { useAppointmentsStore } from '@/store/useAppointmentsStore';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useProductsStore } from '@/store/useProductsStore';
import { useClientsStore } from '@/store/useClientsStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';
import { Zap, MessageCircle, Calendar, Users, Clock, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

export default function DashboardPage() {
  const { appointments, fetchAppointments, isLoading: loadAppts } = useAppointmentsStore();
  const { transactions, fetchTransactions, isLoading: loadFin } = useFinancialStore();
  const { fetchProducts, isLoading: loadProd } = useProductsStore();
  const { clients, fetchClients, isLoading: loadCli } = useClientsStore();
  const router = useRouter();

  const [period, setPeriod] = useState('hoje');
  const [metrics, setMetrics] = useState({ total: 0, dataGrafico: [] as any[] });
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [userData, setUserData] = useState<{name: string, barbershopName: string} | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserData({
            name: data.user.name,
            barbershopName: data.barbershop?.name || 'Administrador'
          });
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchTransactions();
    fetchProducts();
    fetchClients();
  }, [fetchAppointments, fetchTransactions, fetchProducts, fetchClients]);

  useEffect(() => {
    const loadMetrics = async () => {
      setLoadingMetrics(true);
      try {
        const res = await fetch(`/api/finance/metrics?period=${period}`);
        const data = await res.json();
        if (data.success) {
          setMetrics({ total: data.total, dataGrafico: data.dataGrafico });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMetrics(false);
      }
    };
    loadMetrics();
  }, [period]);

  const hoje = new Date().toISOString().split('T')[0];
  const validAppointments = appointments.filter(a => a.status !== 'cancelado');
  const agendamentosHoje = validAppointments.filter((a) => a.data === hoje);
  const totalClientes = clients.length;

  const isLoading = loadAppts || loadFin || loadProd || loadCli;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center pt-20">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentDateFormatted = format(new Date(), "EEEE, d 'De' MMMM 'De' yyyy", { locale: ptBR }).replace(/^\w/, c => c.toUpperCase());

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Boa tarde, <span className="text-primary">{userData?.name || '...'}</span></h2>
        <p className="text-muted-foreground mt-1 text-sm capitalize">{currentDateFormatted}</p>
      </div>

      {/* Banners */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              <Zap className="w-5 h-5" fill="currentColor" />
            </div>
            <div>
              <h4 className="font-semibold text-sm flex items-center gap-1">{userData?.name || '...'} <span className="text-primary text-xs">★</span></h4>
              <p className="text-[11px] text-muted-foreground">{userData?.barbershopName || 'Carregando...'}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8 px-3 rounded-lg" onClick={() => router.push('/configuracoes?tab=plano')}>
            Meu plano &gt;
          </Button>
        </div>


      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="p-4 rounded-2xl bg-secondary/30 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Hoje</p>
            <p className="font-bold text-lg leading-none">{agendamentosHoje.length}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">agendamentos</p>
          </div>
        </div>
        
        <div className="p-4 rounded-2xl bg-secondary/30 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Semana</p>
            <p className="font-bold text-lg leading-none">{validAppointments.length}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">agendamentos</p>
          </div>
        </div>
        
        <div className="p-4 rounded-2xl bg-secondary/30 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Clientes</p>
            <p className="font-bold text-lg leading-none">{totalClientes}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">cadastrados</p>
          </div>
        </div>
        
        <div className="p-4 rounded-2xl bg-secondary/30 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Próx. horário</p>
            <p className="font-bold text-lg leading-none">13:00</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">30min disponível</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-5 rounded-3xl bg-secondary/20 border border-white/5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">Receita</h3>
            <p className="text-xs text-muted-foreground">Visão geral financeira</p>
          </div>
          <button 
            onClick={() => router.push('/financeiro')}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mb-8">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-transparent text-xs text-muted-foreground mb-1 outline-none cursor-pointer border-none p-0 focus:ring-0"
          >
            <option value="hoje" className="bg-zinc-900 text-white">Hoje</option>
            <option value="semana" className="bg-zinc-900 text-white">Nesta Semana</option>
            <option value="mes" className="bg-zinc-900 text-white">Neste Mês</option>
            <option value="ano" className="bg-zinc-900 text-white">Neste Ano</option>
          </select>
          <h2 className="text-4xl font-bold">
            {loadingMetrics ? '...' : `R$ ${metrics.total.toFixed(2).replace('.', ',')}`}
          </h2>
        </div>
        
        <div className="h-[120px] w-full -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.dataGrafico} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
