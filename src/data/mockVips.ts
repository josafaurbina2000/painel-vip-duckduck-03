
import { VIP } from "@/types/vip";

// Mock data para demonstração - ZERADO para integração com Supabase
export const mockVips: VIP[] = [];

// Recalcula o status baseado na data atual
export const getVipsWithCurrentStatus = (): VIP[] => {
  return mockVips.map(vip => {
    const now = new Date();
    const endDate = new Date(vip.endDate);
    const status = endDate >= now ? 'active' : 'expired';
    
    return { ...vip, status };
  });
};
