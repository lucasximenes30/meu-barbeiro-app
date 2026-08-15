'use client';

import { useEffect } from 'react';
import { useReportsStore } from '@/store/useReportsStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Download, FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { ReportPDF } from '@/components/ReportPDF';

const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), {
  ssr: false,
});

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function RelatoriosPage() {
  const { 
    periodType, selectedMonth, selectedYear, 
    monthlyReport, yearlyReport, isLoading, 
    setPeriodType, setSelectedMonth, setSelectedYear,
    fetchMonthlyReport, fetchYearlyReport
  } = useReportsStore();

  useEffect(() => {
    if (periodType === 'monthly') {
      fetchMonthlyReport();
    } else {
      fetchYearlyReport();
    }
  }, [periodType, selectedMonth, selectedYear, fetchMonthlyReport, fetchYearlyReport]);

  const handlePrev = () => {
    if (periodType === 'monthly') {
      if (selectedMonth === 1) {
        setSelectedMonth(12);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      setSelectedYear(selectedYear - 1);
    }
  };

  const handleNext = () => {
    if (periodType === 'monthly') {
      if (selectedMonth === 12) {
        setSelectedMonth(1);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    } else {
      setSelectedYear(selectedYear + 1);
    }
  };

  const currentData = periodType === 'monthly' ? monthlyReport : yearlyReport;
  const renderVariation = (value?: number) => {
    if (value === undefined || value === 0) return <span className="text-muted-foreground flex items-center text-xs"><Minus className="w-3 h-3 mr-1"/> 0%</span>;
    const isPositive = value > 0;
    return (
      <span className={`flex items-center text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  if (!currentData && isLoading) {
    return (
      <div className="flex h-full items-center justify-center pt-20">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const dateLabel = periodType === 'monthly' 
    ? format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy', { locale: ptBR })
    : selectedYear.toString();

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Relatórios</h2>
          <p className="text-muted-foreground mt-1 text-sm">Acompanhe o desempenho do seu negócio</p>
        </div>
        
        <div className="flex items-center gap-4">
          {currentData && (
            <PDFDownloadLink
              document={<ReportPDF data={currentData} periodType={periodType} dateLabel={dateLabel} barbershopName="Meu Barbeiro" />}
              fileName={`relatorio-${periodType}-${selectedMonth}-${selectedYear}.pdf`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors"
            >
              {({ loading }) => loading ? 'Gerando relatório...' : <><FileText className="w-4 h-4" /> Exportar PDF</>}
            </PDFDownloadLink>
          )}
          <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-xl border border-white/5">
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${periodType === 'monthly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setPeriodType('monthly')}
            >
              Mensal
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${periodType === 'yearly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setPeriodType('yearly')}
            >
              Anual
            </button>
          </div>
        </div>
      </div>

      {/* Date Navigator */}
      <div className="flex items-center justify-center gap-4 py-2">
        <button onClick={handlePrev} className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <span className="text-lg font-bold capitalize w-48 text-center">{dateLabel}</span>
        <button onClick={handleNext} className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {currentData ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-secondary/30 border border-white/5 space-y-2">
              <p className="text-sm text-muted-foreground">Faturamento</p>
              <p className="text-2xl font-bold">{formatCurrency(currentData.metrics.revenue)}</p>
              {renderVariation(currentData.variations.revenue)}
            </div>
            <div className="p-5 rounded-2xl bg-secondary/30 border border-white/5 space-y-2">
              <p className="text-sm text-muted-foreground">Despesas</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(currentData.metrics.expenses)}</p>
              {renderVariation(currentData.variations.expenses)}
            </div>
            <div className="p-5 rounded-2xl bg-secondary/30 border border-white/5 space-y-2">
              <p className="text-sm text-muted-foreground">Lucro</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(currentData.metrics.profit)}</p>
              {renderVariation(currentData.variations.profit)}
            </div>
            <div className="p-5 rounded-2xl bg-secondary/30 border border-white/5 space-y-2">
              <p className="text-sm text-muted-foreground">Atendimentos</p>
              <p className="text-2xl font-bold">{currentData.metrics.appointments}</p>
              {renderVariation(currentData.variations.appointments)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-secondary/30 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-xl font-bold">{currentData.metrics.averageTicket ? formatCurrency(currentData.metrics.averageTicket) : 'R$ 0,00'}</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-secondary/30 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Novos Clientes</p>
                <p className="text-xl font-bold">{currentData.metrics.newClients}</p>
              </div>
              {renderVariation(currentData.variations.newClients)}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-3xl bg-secondary/20 border border-white/5">
              <h3 className="font-bold text-lg mb-6">Faturamento no Período</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={(periodType === 'monthly' ? currentData.charts.dailyRevenue : currentData.charts.monthlyRevenue) as any[]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey={periodType === 'monthly' ? 'date' : 'month'} stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                      itemStyle={{ color: '#10b981' }}
                      formatter={(value: any) => [formatCurrency(Number(value || 0)), 'Faturamento']}
                    />
                    <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-secondary/20 border border-white/5">
              <h3 className="font-bold text-lg mb-6">Formas de Pagamento</h3>
              <div className="h-[200px] w-full flex items-center justify-center">
                {currentData.charts.paymentMethods.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentData.charts.paymentMethods}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="amount"
                      >
                        {currentData.charts.paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                        formatter={(value: any) => formatCurrency(Number(value || 0))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground">Sem dados</p>
                )}
              </div>
              <div className="mt-4 space-y-2">
                {(() => {
                  const totalPayments = currentData.charts.paymentMethods.reduce((acc: number, pm: any) => acc + pm.amount, 0);
                  return currentData.charts.paymentMethods.map((pm: any, idx: number) => {
                    const percent = totalPayments > 0 ? (pm.amount / totalPayments) * 100 : 0;
                    return (
                      <div key={pm.method} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <span className="capitalize">{pm.method.toLowerCase()}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{formatCurrency(pm.amount)}</span>
                          <span className="text-xs text-muted-foreground ml-2">({percent.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* Rankings Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-3xl bg-secondary/20 border border-white/5">
              <h3 className="font-bold text-lg mb-4">Top Serviços</h3>
              {currentData.charts.topServices.length > 0 ? (
                <div className="space-y-4">
                  {currentData.charts.topServices.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground font-bold w-4">{idx + 1}.</span>
                        <div>
                          <p className="font-bold text-sm">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.count} realizados</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">{formatCurrency(s.revenue)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">Nenhum serviço realizado no período.</p>
              )}
            </div>

            <div className="p-5 rounded-3xl bg-secondary/20 border border-white/5">
              <h3 className="font-bold text-lg mb-4">Ranking Barbeiros</h3>
              {currentData.charts.topBarbers.length > 0 ? (
                <div className="space-y-4">
                  {currentData.charts.topBarbers.map((b, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500' : idx === 1 ? 'bg-zinc-300/20 text-zinc-300' : idx === 2 ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 text-muted-foreground'}`}>
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{b.name}</p>
                          <p className="text-xs text-muted-foreground">{b.count} atendimentos</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">{formatCurrency(b.revenue)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">Nenhum atendimento realizado no período.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          Nenhum dado encontrado para o período.
        </div>
      )}
    </div>
  );
}
