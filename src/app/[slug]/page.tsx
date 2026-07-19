import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PublicChatbot } from '@/components/PublicChatbot';

export const metadata = {
  title: 'Atendimento - Meu Barbeiro App',
  description: 'Agende seu horário pelo nosso chat digital.',
};

export default async function PublicChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Busca a barbearia pelo slug
  const barbershop = await prisma.barbershop.findUnique({
    where: { slug, isActive: true },
    select: {
      id: true,
      name: true,
      logoUrl: true,
      welcomeMessage: true,
      settings: {
        select: {
          openingTime: true,
          closingTime: true,
        },
      },
      services: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          price: true,
          duration: true
        }
      },
      products: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          price: true
        }
      },
      phone: true
    },
  });

  if (!barbershop) {
    notFound();
  }

  // Prepara os dados para o componente client-side
  const shopData = {
    id: barbershop.id,
    name: barbershop.name,
    phone: barbershop.phone,
    logoUrl: barbershop.logoUrl,
    welcomeMessage: barbershop.welcomeMessage || `Olá! Sou o assistente virtual da ${barbershop.name}. Como posso ajudar você hoje?`,
    services: barbershop.services.map(s => ({
      id: s.id,
      name: s.name,
      price: Number(s.price),
      duration: s.duration,
    })),
    products: barbershop.products.map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
    })),
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row w-full">
      {/* Lado Esquerdo - Info da Barbearia (Desktop) */}
      <div className="hidden md:flex flex-col justify-center items-start p-12 md:w-1/2 lg:w-[60%] border-r border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-black to-black opacity-80"></div>
        
        <div className="z-10 w-full max-w-xl mx-auto">
          {barbershop.logoUrl ? (
            <img src={barbershop.logoUrl} alt={barbershop.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-white/10 mb-8 shadow-2xl shadow-primary/20" />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-3xl shadow-2xl shadow-primary/20 mb-8">
              {barbershop.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Bem-vindo à <br/>
            <span className="text-primary">{barbershop.name}</span>
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl max-w-md leading-relaxed mb-8">
            {barbershop.welcomeMessage || 'Agende seu horário de forma rápida, fácil e 100% digital.'}
          </p>

          <div className="flex items-center gap-4 text-sm font-medium text-zinc-500 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Atendimento Online
            </span>
          </div>
        </div>
      </div>

      {/* Lado Direito - Chat */}
      <div className="flex-1 md:w-1/2 lg:w-[40%] h-[100dvh]">
        <PublicChatbot barbershop={shopData} />
      </div>
    </div>
  );
}
