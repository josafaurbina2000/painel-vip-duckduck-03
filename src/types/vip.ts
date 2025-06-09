
export interface VIP {
  id: string;
  playerName: string;
  startDate: Date;
  durationDays: number;
  endDate: Date;
  amountPaid: number;
  paymentProof: string; // URL do arquivo
  createdAt: Date;
  observations?: string;
  isPermanent: boolean;
  status: 'active' | 'expired' | 'permanent';
}

export interface VIPStats {
  totalActive: number;
  totalExpired: number;
  totalPermanent: number;
  totalRevenue: number;
}

export interface VIPFilters {
  search?: string;
  status?: 'all' | 'active' | 'expired' | 'permanent';
  expiringInDays?: number;
}
