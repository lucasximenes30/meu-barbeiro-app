import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-foreground flex flex-col">
      <header className="h-16 border-b border-white/10 bg-zinc-900 flex items-center px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3 text-white font-bold">
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          Painel do Criador (SaaS)
        </div>
        <nav className="ml-auto text-sm text-zinc-400">
          <Link href="/superadmin" className="hover:text-white transition-colors">
            Dashboard
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
