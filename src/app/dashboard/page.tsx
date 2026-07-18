'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAppointmentsStore } from '@/store/useAppointmentsStore';
import { useFinancialStore } from '@/store/useFinancialStore';
import { useProductsStore } from '@/store/useProductsStore';
import { useClientsStore } from '@/store/useClientsStore';
import { useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, DollarSign, Package, Users } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { appointments, fetchAppointments, isLoading: loadAppts } = useAppointmentsStore();
  const { transactions, fetchTransactions, isLoading: loadFin } = useFinancialStore();
  const { products, fetchProducts, isLoading: loadProd } = useProductsStore();
  const { clients, fetchClients, isLoading: loadCli } = useClientsStore();

  useEffect(() => {
    fetchAppointments();
    fetchTransactions();
    fetchProducts();
    fetchClients();
  }, [fetchAppointments, fetchTransactions, fetchProducts, fetchClients]);

  // Derivando dados mockados para o dashboard
  const hoje = new Date().toISOString().split('T')[0];
  const agendamentosHoje = appointments.filter((a) => a.data === hoje);
  const faturamentoHoje = transactions
    .filter((t) => t.data.startsWith(hoje))
    .reduce((acc, t) => acc + t.valor, 0);
  const produtosBaixoEstoque = products.filter((p) => p.estoque <= 5).length;
  const totalClientes = clients.length;

  const isLoading = loadAppts || loadFin || loadProd || loadCli;

  // Mock de dados para o gráfico de faturamento semanal
  const dataGrafico = [
    { name: 'Seg', total: 150 },
    { name: 'Ter', total: 230 },
    { name: 'Qua', total: 180 },
    { name: 'Qui', total: 320 },
    { name: 'Sex', total: 450 },
    { name: 'Sáb', total: 600 },
    { name: 'Dom', total: 0 },
  ];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h2>
          <p className="text-muted-foreground">Bem-vindo de volta ao BarberPro.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/agendamento" className={buttonVariants()}>
            Novo Agendamento
          </Link>
          <Link href="/produtos" className={buttonVariants({ variant: "secondary" })}>
            Novo Produto
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos (Hoje)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agendamentosHoje.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento (Hoje)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {faturamentoHoje.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{produtosBaixoEstoque}</div>
            <p className="text-xs text-muted-foreground">
              Produtos com 5 ou menos unidades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientes}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Faturamento da Semana</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGrafico}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `R$${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333' }}
                  />
                  <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>
              Você tem {agendamentosHoje.length} agendamentos para hoje.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agendamentosHoje.length > 0 ? (
                agendamentosHoje.map((app) => {
                  const cliente = clients.find((c) => c.id === app.clienteId);
                  return (
                    <div key={app.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium leading-none">{cliente?.nome || 'Cliente não encontrado'}</p>
                        <p className="text-sm text-muted-foreground">{app.hora}</p>
                      </div>
                      <div className="text-sm font-medium capitalize bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        {app.status.replace('_', ' ')}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum agendamento para hoje.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
