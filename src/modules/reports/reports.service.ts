import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears, eachDayOfInterval, format, eachMonthOfInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export class ReportsService {
  async getMonthlyReport(barbershopId: string, month: number, year: number) {
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(startDate);

    const prevStartDate = subMonths(startDate, 1);
    const prevEndDate = endOfMonth(prevStartDate);

    // Fetch current month metrics
    const currentTransactions = await prisma.financialTransaction.findMany({
      where: { barbershopId, deletedAt: null, date: { gte: startDate, lte: endDate } }
    });

    const revenue = currentTransactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + Number(t.amount), 0);
    const expenses = currentTransactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + Number(t.amount), 0);
    const profit = revenue - expenses;

    const currentAppointments = await prisma.appointment.findMany({
      where: { barbershopId, deletedAt: null, date: { gte: startDate, lte: endDate } },
      include: { service: true, user: true }
    });

    const completedAppointments = currentAppointments.filter(a => a.status === 'COMPLETED');
    const appointmentsCount = completedAppointments.length;
    const averageTicket = appointmentsCount > 0 ? revenue / appointmentsCount : 0;

    const currentNewClients = await prisma.customer.count({
      where: { barbershopId, deletedAt: null, createdAt: { gte: startDate, lte: endDate } }
    });

    // Fetch previous month metrics for comparison
    const prevTransactions = await prisma.financialTransaction.findMany({
      where: { barbershopId, deletedAt: null, date: { gte: prevStartDate, lte: prevEndDate } }
    });
    const prevRevenue = prevTransactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + Number(t.amount), 0);
    const prevExpenses = prevTransactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + Number(t.amount), 0);
    
    const prevAppointmentsCount = await prisma.appointment.count({
      where: { barbershopId, deletedAt: null, status: 'COMPLETED', date: { gte: prevStartDate, lte: prevEndDate } }
    });

    // Calculate variations
    const calcVar = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      const variation = ((curr - prev) / prev) * 100;
      return Math.min(Math.max(variation, -100), 100);
    };
    
    const variations = {
      revenue: calcVar(revenue, prevRevenue),
      expenses: calcVar(expenses, prevExpenses),
      profit: calcVar(profit, prevRevenue - prevExpenses),
      appointments: calcVar(appointmentsCount, prevAppointmentsCount)
    };

    // Daily Revenue Chart
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
    const dailyRevenue = daysInMonth.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayTotal = currentTransactions
        .filter(t => t.type === 'INCOME' && format(t.date, 'yyyy-MM-dd') === dayStr)
        .reduce((acc, t) => acc + Number(t.amount), 0);
      return { date: format(day, 'dd/MM'), total: dayTotal };
    });

    // Payment Methods
    const payments = await prisma.payment.findMany({
      where: { barbershopId, createdAt: { gte: startDate, lte: endDate } }
    });
    const paymentMethodsMap = payments.reduce((acc, p) => {
      acc[p.method] = (acc[p.method] || 0) + Number(p.amount);
      return acc;
    }, {} as Record<string, number>);
    const paymentMethods = Object.keys(paymentMethodsMap).map(method => ({
      method,
      amount: paymentMethodsMap[method]
    })).sort((a, b) => b.amount - a.amount);

    // Top Services
    const servicesMap = completedAppointments.reduce((acc, a) => {
      const sId = a.serviceId;
      if (!acc[sId]) acc[sId] = { name: a.service.name, count: 0, revenue: 0 };
      acc[sId].count += 1;
      acc[sId].revenue += Number(a.service.price);
      return acc;
    }, {} as Record<string, { name: string, count: number, revenue: number }>);
    const topServices = Object.values(servicesMap).sort((a, b) => b.revenue - a.revenue);

    // Top Barbers
    const barbersMap = completedAppointments.reduce((acc, a) => {
      const uId = a.userId;
      if (!acc[uId]) acc[uId] = { name: a.user.name, count: 0, revenue: 0 };
      acc[uId].count += 1;
      acc[uId].revenue += Number(a.service.price);
      return acc;
    }, {} as Record<string, { name: string, count: number, revenue: number }>);
    const topBarbers = Object.values(barbersMap).sort((a, b) => b.revenue - a.revenue);

    return {
      metrics: {
        revenue,
        expenses,
        profit,
        appointments: appointmentsCount,
        averageTicket,
        newClients: currentNewClients
      },
      variations,
      charts: {
        dailyRevenue,
        paymentMethods,
        topServices,
        topBarbers
      }
    };
  }

  async getYearlyReport(barbershopId: string, year: number) {
    const startDate = startOfYear(new Date(year, 0, 1));
    const endDate = endOfYear(startDate);

    const prevStartDate = subYears(startDate, 1);
    const prevEndDate = endOfYear(prevStartDate);

    const currentTransactions = await prisma.financialTransaction.findMany({
      where: { barbershopId, deletedAt: null, date: { gte: startDate, lte: endDate } }
    });

    const revenue = currentTransactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + Number(t.amount), 0);
    const expenses = currentTransactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + Number(t.amount), 0);
    const profit = revenue - expenses;

    const appointmentsCount = await prisma.appointment.count({
      where: { barbershopId, deletedAt: null, status: 'COMPLETED', date: { gte: startDate, lte: endDate } }
    });
    
    const newClients = await prisma.customer.count({
      where: { barbershopId, deletedAt: null, createdAt: { gte: startDate, lte: endDate } }
    });

    // Previous year for comparison
    const prevTransactions = await prisma.financialTransaction.findMany({
      where: { barbershopId, deletedAt: null, date: { gte: prevStartDate, lte: prevEndDate } }
    });
    const prevRevenue = prevTransactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + Number(t.amount), 0);
    const prevAppointmentsCount = await prisma.appointment.count({
      where: { barbershopId, deletedAt: null, status: 'COMPLETED', date: { gte: prevStartDate, lte: prevEndDate } }
    });
    const prevNewClients = await prisma.customer.count({
      where: { barbershopId, deletedAt: null, createdAt: { gte: prevStartDate, lte: prevEndDate } }
    });

    const calcVar = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      const variation = ((curr - prev) / prev) * 100;
      return Math.min(Math.max(variation, -100), 100);
    };
    const variations = {
      revenue: calcVar(revenue, prevRevenue),
      appointments: calcVar(appointmentsCount, prevAppointmentsCount),
      newClients: calcVar(newClients, prevNewClients)
    };

    // Monthly Revenue Chart
    const monthsInYear = eachMonthOfInterval({ start: startDate, end: endDate });
    const monthlyRevenue = monthsInYear.map(month => {
      const mStr = format(month, 'yyyy-MM');
      const mTotal = currentTransactions
        .filter(t => t.type === 'INCOME' && format(t.date, 'yyyy-MM') === mStr)
        .reduce((acc, t) => acc + Number(t.amount), 0);
      return { month: format(month, 'MMM', { locale: ptBR }), total: mTotal };
    });

    // Similar Top Lists (but for the year)
    const currentAppointments = await prisma.appointment.findMany({
      where: { barbershopId, deletedAt: null, status: 'COMPLETED', date: { gte: startDate, lte: endDate } },
      include: { service: true, user: true }
    });

    const servicesMap = currentAppointments.reduce((acc, a) => {
      const sId = a.serviceId;
      if (!acc[sId]) acc[sId] = { name: a.service.name, count: 0, revenue: 0 };
      acc[sId].count += 1;
      acc[sId].revenue += Number(a.service.price);
      return acc;
    }, {} as Record<string, { name: string, count: number, revenue: number }>);
    const topServices = Object.values(servicesMap).sort((a, b) => b.revenue - a.revenue);

    const barbersMap = currentAppointments.reduce((acc, a) => {
      const uId = a.userId;
      if (!acc[uId]) acc[uId] = { name: a.user.name, count: 0, revenue: 0 };
      acc[uId].count += 1;
      acc[uId].revenue += Number(a.service.price);
      return acc;
    }, {} as Record<string, { name: string, count: number, revenue: number }>);
    const topBarbers = Object.values(barbersMap).sort((a, b) => b.revenue - a.revenue);

    const payments = await prisma.payment.findMany({
      where: { barbershopId, createdAt: { gte: startDate, lte: endDate } }
    });
    const paymentMethodsMap = payments.reduce((acc, p) => {
      acc[p.method] = (acc[p.method] || 0) + Number(p.amount);
      return acc;
    }, {} as Record<string, number>);
    const paymentMethods = Object.keys(paymentMethodsMap).map(method => ({
      method,
      amount: paymentMethodsMap[method]
    })).sort((a, b) => b.amount - a.amount);

    return {
      metrics: {
        revenue,
        expenses,
        profit,
        appointments: appointmentsCount,
        newClients
      },
      variations,
      charts: {
        monthlyRevenue,
        paymentMethods,
        topServices,
        topBarbers
      }
    };
  }
}
