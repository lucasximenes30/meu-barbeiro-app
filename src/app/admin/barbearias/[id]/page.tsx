import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Scissors, ShoppingBag, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BarbershopDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const shop = await prisma.barbershop.findUnique({
    where: { id: params.id },
    include: {
      users: true,
      _count: {
        select: { customers: true, appointments: true, products: true, services: true }
      }
    }
  });

  if (!shop) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/barbearias">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">{shop.name}</h1>
            {shop.isActive ? (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Ativa</Badge>
            ) : (
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Suspensa</Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">Criada em {new Date(shop.createdAt).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <Tabs defaultValue="resumo" className="w-full">
        <TabsList className="bg-zinc-900/50 border border-white/5">
          <TabsTrigger value="resumo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Resumo</TabsTrigger>
          <TabsTrigger value="usuarios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Equipe</TabsTrigger>
          <TabsTrigger value="financeiro" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Financeiro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resumo" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Total de Clientes</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent><div className="text-3xl font-bold text-white">{shop._count.customers}</div></CardContent>
            </Card>
            <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Serviços Cadastrados</CardTitle>
                <Scissors className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent><div className="text-3xl font-bold text-white">{shop._count.services}</div></CardContent>
            </Card>
            <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Produtos no Estoque</CardTitle>
                <ShoppingBag className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent><div className="text-3xl font-bold text-white">{shop._count.products}</div></CardContent>
            </Card>
            <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">Agendamentos Totais</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent><div className="text-3xl font-bold text-white">{shop._count.appointments}</div></CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usuarios" className="mt-6">
          <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Usuários Vinculados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shop.users.map(u => (
                  <div key={u.id} className="flex justify-between items-center p-4 border border-white/5 rounded-lg bg-white/5">
                    <div>
                      <p className="font-medium text-white">{u.name}</p>
                      <p className="text-sm text-zinc-500">{u.email}</p>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/20">{u.role}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="mt-6">
          <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Histórico Financeiro (Em breve)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-500">Módulo financeiro individual em desenvolvimento.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
