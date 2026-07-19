import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug não fornecido' }, { status: 400 });
    }

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
          }
        },
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            price: true,
            duration: true
          }
        }
      }
    });

    if (!barbershop) {
      return NextResponse.json({ success: false, error: 'Barbearia não encontrada ou inativa' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: barbershop });
  } catch (error) {
    console.error('Public chat API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
