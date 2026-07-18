'use client';

import { useFinancialStore } from '@/store/useFinancialStore';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, TrendingUp, ShoppingBag, Scissors } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function FinanceiroPage() {
  const { transactions, fetchTransactions, isLoading } = useFinancialStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const receitaTotal = transactions.reduce((acc, t) => acc + t.valor, 0);
  const receitaServicos = transactions.filter(t => t.tipo === 'servico').reduce((acc, t) => acc + t.valor, 0);
  const receitaProdutos = transactions.filter(t => t.tipo === 'produto').reduce((acc, t) => acc + t.valor, 0);

  // Mock de dados para o gráfico de faturamento por período
  const dataGrafico = [
    { name: 'Semana 1', serviços: 1200, produtos: 400 },
    { name: 'Semana 2', serviços: 1500, produtos: 350 },
    { name: 'Semana 3', serviços: 1800, produtos: 500 },
    { name: 'Semana 4', serviços: 2000, produtos: 600 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Financeiro</h2>
          <p className="text-muted-foreground">Acompanhe as receitas e o desempenho do seu negócio.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total (Mês)</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {receitaTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviços</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {receitaServicos.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {receitaProdutos.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receita: Serviços vs Produtos</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                <Bar dataKey="serviços" stackId="a" fill="var(--color-primary)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="produtos" stackId="a" fill="var(--color-secondary-foreground)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimas Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>ID Referência</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="inline-block animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhuma transação encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                transactions
                  .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                  .map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{format(new Date(t.data), "dd/MM/yyyy HH:mm")}</TableCell>
                      <TableCell className="capitalize">{t.tipo}</TableCell>
                      <TableCell className="text-muted-foreground">{t.referenciaId}</TableCell>
                      <TableCell className="text-right font-medium text-green-500">
                        + R$ {t.valor.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
