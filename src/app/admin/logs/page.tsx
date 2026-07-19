import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminLogsPage() {
  const logs = await prisma.auditLog.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Auditoria do Sistema</h1>
        <p className="text-muted-foreground mt-2">Registro de atividades sensíveis na plataforma.</p>
      </div>

      <div className="rounded-xl border border-white/5 bg-zinc-950/50 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5 border-b border-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="text-zinc-400 font-medium">Data</TableHead>
              <TableHead className="text-zinc-400 font-medium">Ação</TableHead>
              <TableHead className="text-zinc-400 font-medium">Usuário</TableHead>
              <TableHead className="text-zinc-400 font-medium">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-zinc-400 text-sm whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell className="font-medium text-white">{log.action}</TableCell>
                <TableCell className="text-zinc-400">{log.user?.name || "Sistema"}</TableCell>
                <TableCell className="text-zinc-500 text-sm">{log.details || "-"}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-zinc-500">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
