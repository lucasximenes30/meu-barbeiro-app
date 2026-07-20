'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, Calendar, MessageCircle, Scissors, ShoppingBag, LogOut, DollarSign, Settings, Menu, X } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <>
      {/* Overlay menu for extra options */}
      {isMenuOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="md:hidden fixed bottom-[calc(env(safe-area-inset-bottom,1rem)+70px)] right-4 bg-card border border-white/10 rounded-2xl p-2 shadow-2xl z-50 flex flex-col min-w-[180px] animate-in fade-in zoom-in-95 duration-200">
            <Link href="/servicos" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/servicos' ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-muted-foreground'}`}>
              <Scissors className="w-5 h-5" />
              <span className="text-sm font-medium">Serviços</span>
            </Link>
            <Link href="/produtos" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/produtos' ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-muted-foreground'}`}>
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm font-medium">Produtos</span>
            </Link>
            <Link href="/configuracoes" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/configuracoes' ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-muted-foreground'}`}>
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Configurações</span>
            </Link>
            <div className="h-px bg-white/10 my-1 mx-2" />
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-red-500/10 text-red-500 w-full text-left">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        </>
      )}

      {/* Main Bottom Bar */}
      <div className="md:hidden fixed bottom-0 w-full left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-white/10 z-40 px-6 pt-3 pb-[max(env(safe-area-inset-bottom,1rem),1.5rem)] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between relative">
          
          <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'}`}>
            <LayoutGrid className="w-6 h-6" />
            <span className="text-[10px] font-medium">Início</span>
          </Link>
          
          <Link href="/agendamento" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/agendamento' ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'}`}>
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-medium">Agenda</span>
          </Link>
          
          {/* Floating Action Button - Inbox / Chat */}
          <div className="relative -top-6 px-2">
            <Link href="/chat" className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_20px_var(--color-primary)]/40 hover:scale-105 transition-transform border-4 border-background">
              <MessageCircle className="w-6 h-6" />
            </Link>
          </div>
          
          <Link href="/financeiro" className={`flex flex-col items-center gap-1 transition-all ${pathname === '/financeiro' ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'}`}>
            <DollarSign className="w-6 h-6" />
            <span className="text-[10px] font-medium">Finanças</span>
          </Link>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`flex flex-col items-center gap-1 transition-all ${isMenuOpen ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'}`}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            <span className="text-[10px] font-medium">Mais</span>
          </button>
          
        </div>
      </div>
    </>
  );
}
