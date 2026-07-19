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
    },
  });

  if (!barbershop) {
    notFound();
  }

  // Prepara os dados para o componente client-side
  const shopData = {
    id: barbershop.id,
    name: barbershop.name,
    logoUrl: barbershop.logoUrl,
    welcomeMessage: barbershop.welcomeMessage || `Olá! Sou o assistente virtual da ${barbershop.name}. Como posso ajudar você hoje?`,
  };

  return (
    <div className="min-h-screen bg-black">
      <PublicChatbot barbershop={shopData} />
    </div>
  );
}
