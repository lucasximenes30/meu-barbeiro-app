  'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, Calendar, MessageCircle, Scissors, ShoppingBag, LogOut, DollarSign } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const router = useRouter();

  // Hide BottomNav on public booking page, login, admin panels and registration
  if (
    pathname.startsWith('/agendar') || 
    pathname.startsWith('/admin') || 
    pathname === '/login' ||
    pathname === '/cadastro' ||
    pathname === '/'
  ) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    window.location.href = '/login';
  };

  return (
    <div className="md:hidden fixed bottom-0 w-full left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-white/10 z-50 px-4 py-3 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        
        <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'}`}>
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium hidden sm:block">Início</span>
        </Link>
        
        <Link href="/agendamento" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/agendamento' ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'}`}>
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium hidden sm:block">Agenda</span>
        </Link>
        
        {/* Floating Action Button - Inbox / Chat */}
        <div className="relative -top-6 px-1">
          <Link href="/chat" className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_20px_var(--color-primary)]/40 hover:scale-105 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </Link>
        </div>
        
        <Link href="/servicos" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/servicos' ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'}`}>
          <Scissors className="w-5 h-5" />
          <span className="text-[10px] font-medium hidden sm:block">Serviços</span>
        </Link>
        
        <Link href="/produtos" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/produtos' ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'}`}>
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium hidden sm:block">Produtos</span>
        </Link>

        <Link href="/financeiro" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/financeiro' ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'}`}>
          <DollarSign className="w-5 h-5" />
          <span className="text-[10px] font-medium hidden sm:block">Financeiro</span>
        </Link>

        <button onClick={handleLogout} className="flex flex-col items-center gap-1 transition-all text-muted-foreground hover:text-red-500">
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-medium hidden sm:block">Sair</span>
        </button>
        
      </div>
    </div>
  );
}
