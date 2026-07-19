import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function SuperAdminDashboard() {
  
  // Puxar as estatísticas gerais
  const totalBarbershops = await prisma.barbershop.count();
  const totalUsers = await prisma.user.count();

  // Últimas barbearias cadastradas
  const latestBarbershops = await prisma.barbershop.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      users: {
        where: { role: 'OWNER' },
        take: 1
      }
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Global</h1>
        <p className="text-zinc-400">Bem-vindo ao painel de administração do SaaS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total de Barbearias</CardTitle>
            <Store className="w-4 h-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalBarbershops}</div>
            <p className="text-xs text-zinc-500 mt-1">Lojas ativas na plataforma</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total de Usuários</CardTitle>
            <Users className="w-4 h-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalUsers}</div>
            <p className="text-xs text-zinc-500 mt-1">Profissionais utilizando o app</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-white">Últimos Cadastros</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 bg-zinc-950/50 border-b border-zinc-800 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Barbearia</th>
                  <th className="px-6 py-4 font-medium">Proprietário (E-mail)</th>
                  <th className="px-6 py-4 font-medium">Data de Cadastro</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {latestBarbershops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-zinc-200 font-medium">{shop.name}</td>
                    <td className="px-6 py-4 text-zinc-400">
                      {shop.users[0]?.name || 'Desconhecido'} <br />
                      <span className="text-xs text-zinc-500">{shop.users[0]?.email || 'S/ email'}</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {format(new Date(shop.createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {shop.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                          Inativo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {latestBarbershops.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                      Nenhuma barbearia cadastrada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
