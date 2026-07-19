import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, MoreHorizontal, Search, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";

export default async function BarbershopsPage() {
  const barbershops = await prisma.barbershop.findMany({
    include: {
      _count: {
        select: { users: true, customers: true, appointments: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Barbearias</h1>
          <p className="text-muted-foreground mt-2">Gerencie todas as barbearias conectadas à plataforma.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Buscar barbearia..." 
              className="w-full bg-zinc-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
            />
          </div>
          <Link href="/admin/barbearias/nova">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="w-4 h-4" />
              Nova Barbearia
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-zinc-950/50 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5 border-b border-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="text-zinc-400 font-medium">Nome / Contato</TableHead>
              <TableHead className="text-zinc-400 font-medium">Status</TableHead>
              <TableHead className="text-zinc-400 font-medium text-center">Usuários</TableHead>
              <TableHead className="text-zinc-400 font-medium text-center hidden md:table-cell">Clientes</TableHead>
              <TableHead className="text-zinc-400 font-medium text-right">Criada em</TableHead>
              <TableHead className="text-zinc-400 font-medium w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {barbershops.map((shop) => (
              <TableRow key={shop.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-medium text-white">
                  <div>
                    {shop.name}
                    <div className="text-xs text-zinc-500 font-normal mt-1">{shop.phone || "Sem telefone"}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {shop.isActive ? (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Ativa</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Suspensa</Badge>
                  )}
                </TableCell>
                <TableCell className="text-center text-zinc-400">
                  {shop._count.users}
                </TableCell>
                <TableCell className="text-center text-zinc-400 hidden md:table-cell">
                  {shop._count.customers}
                </TableCell>
                <TableCell className="text-right text-zinc-400 text-sm">
                  {new Date(shop.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-zinc-300">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <Link href={`/admin/barbearias/${shop.id}`}>
                          <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                            Ver detalhes
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/admin/barbearias/${shop.id}/config`}>
                          <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                            <Settings className="w-4 h-4 mr-2" />
                            Configurações
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            
            {barbershops.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                  Nenhuma barbearia cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
