
import { VIP, VIPStats } from "@/types/vip";

export const calculateVIPStatus = (vip: VIP): 'active' | 'expired' | 'permanent' => {
  if (vip.isPermanent) return 'permanent';
  
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

export const calculateStats = (vips: VIP[]): VIPStats => {
  const stats = vips.reduce((acc, vip) => {
    const status = calculateVIPStatus(vip);
    
    switch (status) {
      case 'active':
        acc.totalActive++;
        acc.totalRevenue += vip.amountPaid;
        break;
      case 'expired':
        acc.totalExpired++;
        break;
      case 'permanent':
        acc.totalPermanent++;
        acc.totalRevenue += vip.amountPaid;
        break;
    }
    
    return acc;
  }, {
    totalActive: 0,
    totalExpired: 0,
    totalPermanent: 0,
    totalRevenue: 0
  });

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
    if (filters.expiringInDays && !vip.isPermanent) {
      const daysRemaining = calculateDaysRemaining(vip.endDate);
      if (daysRemaining > filters.expiringInDays || daysRemaining <= 0) {
        return false;
      }
    }

    return true;
  });
};
