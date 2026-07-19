import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { AdminChart } from "@/components/AdminChart";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  // Fetch real aggregated data
  const [
    totalBarbershops,
    activeBarbershops,
    totalUsers,
    totalCustomers,
    totalAppointments,
    revenueData,
    activeShopsData
  ] = await Promise.all([
    prisma.barbershop.count(),
    prisma.barbershop.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.customer.count(),
    prisma.appointment.count(),
    prisma.barbershop.aggregate({
      where: { isActive: true },
      _sum: { subscriptionFee: true }
    }),
    prisma.barbershop.findMany({
      where: { isActive: true },
      select: { createdAt: true, subscriptionFee: true }
    })
  ]);

  const totalRevenue = revenueData._sum.subscriptionFee ? Number(revenueData._sum.subscriptionFee) : 0;
  const formattedRevenue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue);

  // Calcula o MRR (Receita Recorrente) dos últimos 6 meses
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const chartData = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = months[d.getMonth()];
    
    // Soma as mensalidades de todas as barbearias ativas criadas ATÉ aquele mês
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0); // Último dia do mês
    const revenueInMonth = activeShopsData
      .filter(shop => new Date(shop.createdAt) <= endOfMonth)
      .reduce((sum, shop) => sum + Number(shop.subscriptionFee), 0);
      
    chartData.push({
      name: monthName,
      Receita: revenueInMonth
    });
  }

  const stats = [
    {
      title: "Total de Barbearias",
      value: totalBarbershops.toString(),
      icon: Store,
      trend: "+12%",
      trendUp: true,
      description: `${activeBarbershops} ativas atualmente`
    },
    {
      title: "Receita Global (Mês)",
      value: formattedRevenue,
      icon: DollarSign,
      trend: "+8.2%",
      trendUp: true,
      description: "Em relação ao mês anterior"
    },
    {
      title: "Total de Clientes",
      value: totalCustomers.toString(),
      icon: Users,
      trend: "+24%",
      trendUp: true,
      description: "Cadastrados nas franquias"
    },
    {
      title: "Agendamentos Realizados",
      value: totalAppointments.toString(),
      icon: Calendar,
      trend: "-2%",
      trendUp: false,
      description: "Neste mês"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Global</h1>
        <p className="text-muted-foreground mt-2">Visão geral do desempenho de todas as barbearias na plataforma.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-zinc-950/50 border-white/5 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`flex items-center text-xs font-medium ${stat.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {stat.trend}
                  </span>
                  <span className="text-xs text-zinc-500">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 bg-zinc-950/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Crescimento de Receita
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t border-white/5 p-4 pt-6">
            <AdminChart data={chartData} />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3 bg-zinc-950/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Últimas Atividades</CardTitle>
          </CardHeader>
          <CardContent className="border-t border-white/5 pt-4">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-white leading-none">Nova barbearia cadastrada</p>
                    <p className="text-xs text-zinc-500">Barbearia Vintage ingressou na plataforma.</p>
                  </div>
                  <span className="text-xs text-zinc-600">Há 2h</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
