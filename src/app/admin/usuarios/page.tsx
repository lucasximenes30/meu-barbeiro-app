import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { barbershop: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Usuários Globais</h1>
        <p className="text-muted-foreground mt-2">Gestão de acessos de todas as barbearias.</p>
      </div>

      <div className="rounded-xl border border-white/5 bg-zinc-950/50 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5 border-b border-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="text-zinc-400 font-medium">Usuário</TableHead>
              <TableHead className="text-zinc-400 font-medium">Barbearia</TableHead>
              <TableHead className="text-zinc-400 font-medium text-center">Permissão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="font-medium text-white">
                  {user.name}
                  <div className="text-xs text-zinc-500">{user.email}</div>
                </TableCell>
                <TableCell className="text-zinc-400">
                  {user.barbershop?.name || "Sistema Base (Super Admin)"}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={user.role === 'SUPER_ADMIN' ? 'text-indigo-400 border-indigo-400/20 bg-indigo-500/10' : 'text-primary border-primary/20'}>
                    {user.role}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
