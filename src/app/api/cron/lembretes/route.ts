import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { addHours, format, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export async function GET(req: NextRequest) {
  try {
    // Proteção simples: Idealmente isso seria chamado por um Cron com Authorization header.
    // Para nosso teste, vamos liberar o GET.

    const now = new Date();
    // Buscar agendamentos que acontecem nas próximas 24 horas e ainda estão como PENDING ou CONFIRMED
    const tomorrow = addHours(now, 24);

    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gt: now,
          lte: tomorrow
        },
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        // Na prática, você precisaria de um campo "reminderSent" no BD para evitar spam.
        // Como não temos esse campo, faremos uma simulação ou checaremos se falta menos de 2 horas.
      },
      include: {
        customer: true,
        barbershop: true,
        service: true,
      }
    });

    let emailsSent = 0;

    for (const appt of upcomingAppointments) {
      if (appt.customer.email) {
        const timeStr = format(appt.date, "HH:mm");
        const dateStr = format(appt.date, "dd/MM/yyyy");
        
        const html = `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Olá, ${appt.customer.name}!</h2>
            <p>Este é um lembrete do seu agendamento na <strong>${appt.barbershop.name}</strong>.</p>
            <p><strong>Serviço:</strong> ${appt.service.name}</p>
            <p><strong>Data:</strong> ${dateStr} às ${timeStr}</p>
            <br/>
            <p>Por favor, chegue com 5 minutos de antecedência.</p>
            <p>Até logo!</p>
          </div>
        `;

        await sendEmail({
          to: appt.customer.email,
          subject: 'Lembrete de Agendamento - Meu Barbeiro App',
          html,
        });

        emailsSent++;
      }
    }

    // Criar uma notificação no sistema para o barbeiro
    // (Opcional: inserção em uma tabela Notification se existir, senão apenas retorna sucesso)

    return NextResponse.json({ 
      success: true, 
      message: `Cron job executed successfully. ${emailsSent} emails sent.`,
      found: upcomingAppointments.length
    });
  } catch (error: any) {
    console.error('Cron Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
