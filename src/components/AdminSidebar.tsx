'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Store, Users, DollarSign, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export function AdminSidebar() {
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
    { name: 'Auditoria', href: '/admin/logs', icon: ShieldAlert },
    { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-black/90 backdrop-blur-2xl border-r border-white/5 h-full p-6 justify-between">
      <div>
        <div className="mb-10 pl-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">SaaS Admin</h1>
          <p className="text-xs text-primary/80 mt-1 uppercase font-semibold tracking-widest">Master Control</p>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/20 text-white border border-primary/30 shadow-inner' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-zinc-500'}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
            S
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Super Admin</p>
            <p className="text-[10px] text-zinc-500">Acesso Irrestrito</p>
          </div>
        </div>
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-zinc-500 hover:text-destructive hover:bg-destructive/10">
          <LogOut className="w-4 h-4 mr-2" />
          Sair do Painel
        </Button>
      </div>
    </aside>
  );
}
