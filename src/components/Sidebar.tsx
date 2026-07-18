'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Calendar,
  Users,
  Scissors,
  DollarSign,
  Settings,
  Menu,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Produtos', href: '/produtos', icon: Package },
  { name: 'Agendamento', href: '/agendamento', icon: Calendar },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Serviços', href: '/servicos', icon: Scissors },
  { name: 'Financeiro', href: '/financeiro', icon: DollarSign },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavLinks = () => (
    <nav className="space-y-2 mt-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Nav */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-lg shrink-0 sticky top-0 z-10">
        <div className="font-bold text-xl text-primary drop-shadow-[0_0_10px_rgba(200,150,50,0.4)]">BarberPro</div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            }
          />
          <SheetContent side="left" className="w-64 glass-effect border-r-white/10">
            <div className="font-bold text-2xl text-primary mb-6 mt-4 drop-shadow-[0_0_10px_rgba(200,150,50,0.4)]">BarberPro</div>
            <NavLinks />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r border-white/5 glass-effect h-full min-h-screen px-4 py-6 relative z-10">
        <div className="font-bold text-2xl text-primary mb-8 px-2 drop-shadow-[0_0_10px_rgba(200,150,50,0.4)]">BarberPro</div>
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
      </div>
    </>
  );
}
