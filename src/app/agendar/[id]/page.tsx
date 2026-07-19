import { ClientPortal } from '@/components/ClientPortal';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function AgendarPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const barbershop = await prisma.barbershop.findUnique({
    where: { id }
  });

  if (!barbershop) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 pt-10">
      <ClientPortal barbershopId={barbershop.id} barbershopName={barbershop.name} />
    </div>
  );
}
