import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const barbershopId = (await params).slug; // since we passed barbershop.id in the URL
    const body = await req.json();
    const { conversationId, name, phone, serviceId, date: dateStr, time, productId } = body;

    // Achar um barbeiro padrão para associar (o primeiro ativo da barbearia)
    const defaultUser = await prisma.user.findFirst({
      where: { barbershopId, isActive: true },
    });

    if (!defaultUser) {
      throw new Error('Nenhum barbeiro ativo encontrado para esta barbearia');
    }

    // Achar ou criar Customer
    let customer = await prisma.customer.findFirst({
      where: { barbershopId, phone }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          barbershopId,
          name,
          phone,
        }
      });
    }

    // Processar Data e Hora
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    if (dateStr) {
      const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (match) {
        date.setDate(Number(match[1]));
        date.setMonth(Number(match[2]) - 1);
        date.setFullYear(Number(match[3]));
      } else {
        const dStr = dateStr.toLowerCase();
        if (dStr === 'amanhã' || dStr === 'amanha') {
          date.setDate(date.getDate() + 1);
        } else if (dStr !== 'hoje') {
          const parts = dateStr.split('/');
          if (parts.length >= 2) {
            date.setDate(Number(parts[0]));
            date.setMonth(Number(parts[1]) - 1);
            if (parts[2]) {
               let year = Number(parts[2]);
               if (year < 100) year += 2000;
               date.setFullYear(year);
            }
          }
        }
      }
    } else if (date < new Date()) {
      // fallback antigo
      date.setDate(date.getDate() + 1);
    }

    // Fetch Service to get price
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new Error('Serviço não encontrado');

    // Criar o Agendamento
    const appointment = await prisma.appointment.create({
      data: {
        barbershopId,
        customerId: customer.id,
        userId: defaultUser.id,
        serviceId,
        date,
        status: 'PENDING',
        notes: 'Agendado pelo Chat Automático'
      }
    });

    // Registar a transação financeira do serviço
    await prisma.financialTransaction.create({
      data: {
        barbershopId,
        type: 'INCOME',
        amount: service.price,
        description: `Agendamento: ${service.name}`,
        date,
        appointmentId: appointment.id
      }
    });

    // Se comprou um produto (Order Bump)
    if (productId) {
      const product = await prisma.product.findUnique({ where: { id: productId }});
      if (product) {
        const sale = await prisma.productSale.create({
          data: {
            barbershopId,
            productId: product.id,
            customerId: customer.id,
            quantity: 1,
            totalPrice: product.price,
          }
        });

        // Registar a transação financeira do produto
        await prisma.financialTransaction.create({
          data: {
            barbershopId,
            type: 'INCOME',
            amount: product.price,
            description: `Venda de Produto: ${product.name}`,
            date, // Use the appointment date so they align
            saleId: sale.id
          }
        });
      }
    }

    // Atualiza a conversa
    if (conversationId) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          customerId: customer.id,
          status: 'resolved'
        }
      });
    }

    return NextResponse.json({ success: true, appointmentId: appointment.id });
  } catch (error) {
    console.error('Book API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
