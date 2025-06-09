
import { VIP, VIPStats } from "@/types/vip";
import { startOfMonth, endOfMonth, isWithinInterval, subMonths } from "date-fns";

export const calculateVIPStatus = (vip: VIP): 'active' | 'expired' => {
  const now = new Date();
  const endDate = new Date(vip.endDate);
  
  return endDate >= now ? 'active' : 'expired';
};

export const calculateDaysRemaining = (endDate: Date): number => {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const calculateMonthlyRevenue = (vips: VIP[]): number => {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);

  return vips
    .filter(vip => {
      const createdAt = new Date(vip.createdAt);
      return isWithinInterval(createdAt, {
        start: startOfCurrentMonth,
        end: endOfCurrentMonth
      });
    })
    .reduce((total, vip) => total + vip.amountPaid, 0);
};

export const calculateMonthlyTrend = (vips: VIP[]): number => {
  const now = new Date();
  const currentMonth = calculateMonthlyRevenue(vips);
  
  const lastMonth = subMonths(now, 1);
  const startOfLastMonth = startOfMonth(lastMonth);
  const endOfLastMonth = endOfMonth(lastMonth);
  
  const lastMonthRevenue = vips
    .filter(vip => {
      const createdAt = new Date(vip.createdAt);
      return isWithinInterval(createdAt, {
        start: startOfLastMonth,
        end: endOfLastMonth
      });
    })
    .reduce((total, vip) => total + vip.amountPaid, 0);

  if (lastMonthRevenue === 0) return currentMonth > 0 ? 100 : 0;
  
  return ((currentMonth - lastMonthRevenue) / lastMonthRevenue) * 100;
};

export const calculateStats = (vips: VIP[]): VIPStats => {
  const stats = vips.reduce((acc, vip) => {
    const status = calculateVIPStatus(vip);
    
    if (status === 'active') {
      acc.totalActive++;
      acc.totalRevenue += vip.amountPaid;
    } else {
      acc.totalExpired++;
    }
    
    return acc;
  }, {
    totalActive: 0,
    totalExpired: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    monthlyTrend: 0,
    expiringInDays: 0
  });

  // Calcular receita mensal
  stats.monthlyRevenue = calculateMonthlyRevenue(vips);
  stats.monthlyTrend = calculateMonthlyTrend(vips);

  // Calcular VIPs expirando nos próximos 7 dias
  stats.expiringInDays = vips.filter(vip => {
    const daysRemaining = calculateDaysRemaining(vip.endDate);
    return daysRemaining > 0 && daysRemaining <= 7;
  }).length;

  return stats;
};

export const filterVIPs = (vips: VIP[], filters: { search?: string; status?: string; expiringInDays?: number }): VIP[] => {
  return vips.filter(vip => {
    // Filtro de busca
    if (filters.search && !vip.playerName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Filtro de status
    if (filters.status && filters.status !== 'all') {
      const vipStatus = calculateVIPStatus(vip);
      if (vipStatus !== filters.status) {
        return false;
      }
    }

    // Filtro de vencimento próximo
    if (filters.expiringInDays) {
      const daysRemaining = calculateDaysRemaining(vip.endDate);
      if (daysRemaining > filters.expiringInDays || daysRemaining <= 0) {
        return false;
      }
    }

    return true;
  });
};
