'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Store, Users, DollarSign, Menu, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';

export function AdminMobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    window.location.href = '/login';
  };

  const menuItems = [
    { name: 'Visão Geral', href: '/admin', icon: LayoutDashboard },
    { name: 'Barbearias', href: '/admin/barbearias', icon: Store },
    { name: 'Usuários', href: '/admin/usuarios', icon: Users },
    { name: 'Financeiro', href: '/admin/financeiro', icon: DollarSign },
  ];

  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
          <span className="text-primary font-bold text-xs">SA</span>
        </div>
        <span className="font-bold text-white tracking-tight">Master Control</span>
      </div>
      
      <Sheet>
        <SheetTrigger className="flex h-10 w-10 items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none">
          <Menu className="w-6 h-6" />
        </SheetTrigger>
        <SheetContent side="right" className="bg-zinc-950 border-white/10 p-0 w-72">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Menu Principal</h2>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/20 text-white' 
                        : 'text-zinc-400 hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-zinc-500'}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/5">
              <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-zinc-500 hover:text-red-500 hover:bg-red-500/10">
                <LogOut className="w-4 h-4 mr-2" />
                Sair do Painel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
