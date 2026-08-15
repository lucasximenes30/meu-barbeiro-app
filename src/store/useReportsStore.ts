import { create } from 'zustand';

interface ReportMetrics {
  revenue: number;
  expenses: number;
  profit: number;
  appointments: number;
  averageTicket?: number;
  newClients: number;
}

interface ReportVariations {
  revenue: number;
  expenses?: number;
  profit?: number;
  appointments: number;
  newClients?: number;
}

interface ReportCharts {
  dailyRevenue?: { date: string; total: number }[];
  monthlyRevenue?: { month: string; total: number }[];
  paymentMethods: { method: string; amount: number }[];
  topServices: { name: string; count: number; revenue: number }[];
  topBarbers: { name: string; count: number; revenue: number }[];
}

interface ReportData {
  metrics: ReportMetrics;
  variations: ReportVariations;
  charts: ReportCharts;
}

interface ReportsState {
  periodType: 'monthly' | 'yearly';
  selectedMonth: number;
  selectedYear: number;
  
  monthlyReport: ReportData | null;
  yearlyReport: ReportData | null;
  
  isLoading: boolean;
  error: string | null;

  setPeriodType: (type: 'monthly' | 'yearly') => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  
  fetchMonthlyReport: () => Promise<void>;
  fetchYearlyReport: () => Promise<void>;
}

export const useReportsStore = create<ReportsState>((set, get) => ({
  periodType: 'monthly',
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),
  
  monthlyReport: null,
  yearlyReport: null,
  
  isLoading: false,
  error: null,

  setPeriodType: (type) => set({ periodType: type }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setSelectedYear: (year) => set({ selectedYear: year }),

  fetchMonthlyReport: async () => {
    const { selectedMonth, selectedYear } = get();
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/reports/monthly?month=${selectedMonth}&year=${selectedYear}`);
      const data = await res.json();
      if (data.success) {
        set({ monthlyReport: data.report });
      } else {
        set({ error: data.error || 'Failed to fetch monthly report' });
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchYearlyReport: async () => {
    const { selectedYear } = get();
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/reports/yearly?year=${selectedYear}`);
      const data = await res.json();
      if (data.success) {
        set({ yearlyReport: data.report });
      } else {
        set({ error: data.error || 'Failed to fetch yearly report' });
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  }
}));
