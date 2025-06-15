export interface VIPFile {
  name: string;
  type: string;
  size: number;
  data?: string; // base64 encoded (mantido para compatibilidade)
  url?: string;  // URL do Supabase Storage
  path?: string; // Caminho no storage
}

export interface VIP {
  id: string;
  playerName: string;
  startDate: Date;
  durationDays: number;
  endDate: Date;
  amountPaid: number;
  paymentProof?: VIPFile;
  createdAt: Date;
  observations?: string;
  status: 'active' | 'expired';
}

export interface VIPStats {
  totalActive: number;
  totalExpired: number;
  totalRevenue: number;
  monthlyRevenue: number;
  monthlyTrend: number;
  expiringInDays: number;
}

export interface VIPFilters {
  search?: string;
  status?: 'all' | 'active' | 'expired';
  expiringInDays?: number;
}
