  'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Calendar, MessageCircle, Scissors, ShoppingBag } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  // Hide BottomNav on public booking page and login
  if (pathname.startsWith('/agendar') || pathname === '/login') {
    return null;
  }

  return (
    <div className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-white/10 z-50 px-6 py-3 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        
        <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'}`}>
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium">Início</span>
        </Link>
        
        <Link href="/agendamento" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/agendamento' ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'}`}>
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium">Agenda</span>
        </Link>
        
        {/* Floating Action Button - Inbox / Chat */}
        <div className="relative -top-6">
          <Link href="/chat" className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_20px_var(--color-primary)]/40 hover:scale-105 transition-transform">
            <MessageCircle className="w-7 h-7" />
          </Link>
        </div>
        
        <Link href="/servicos" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/servicos' ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'}`}>
          <Scissors className="w-5 h-5" />
          <span className="text-[10px] font-medium">Serviços</span>
        </Link>
        
        <Link href="/produtos" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/produtos' ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'}`}>
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium">Produtos</span>
        </Link>
        
      </div>
    </div>
  );
}
