'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Calendar, MessageCircle, Scissors, ShoppingBag, Settings, LogOut, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<{name: string, barbershopName: string} | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserData({
            name: data.user.name,
            barbershopName: data.barbershop?.name || 'Administrador'
          });
        }
      })
      .catch(console.error);
  }, []);

  // Hide Sidebar on public pages and admin pages
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

  const menuItems = [
    { name: 'Início', href: '/dashboard', icon: LayoutGrid },
    { name: 'Agenda', href: '/agendamento', icon: Calendar },
    { name: 'Chat Automático', href: '/chat', icon: MessageCircle },
    { name: 'Serviços', href: '/servicos', icon: Scissors },
    { name: 'Produtos', href: '/produtos', icon: ShoppingBag },
    { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-card/20 backdrop-blur-2xl border-r border-white/10 h-full p-6 justify-between">
      <div>
        <div className="mb-10 pl-2">
          <h1 className="text-2xl font-bold text-primary drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Meu Barbeiro</h1>
          <p className="text-xs text-muted-foreground mt-1">Gestão Inteligente</p>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--color-primary),0.1)]' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{userData?.name || '...'}</p>
            <p className="text-[10px] text-muted-foreground">{userData?.barbershopName || '...'}</p>
          </div>
        </div>
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <LogOut className="w-4 h-4 mr-2" />
          Sair do Sistema
        </Button>
      </div>
    </aside>
  );
}
