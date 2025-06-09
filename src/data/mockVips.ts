
import { VIP } from "@/types/vip";

// Mock data para demonstração - em um app real, isso viria de uma API/banco de dados
export const mockVips: VIP[] = [
  {
    id: "1",
    playerName: "SnIpEr_BF4_PRO",
    startDate: new Date("2024-06-01"),
    durationDays: 30,
    endDate: new Date("2024-07-01"),
    amountPaid: 25.00,
    paymentProof: undefined,
    createdAt: new Date("2024-06-01"),
    observations: "Pagamento via PIX, cliente frequente",
    status: 'active'
  },
  {
    id: "2",
    playerName: "xXx_DESTROYER_xXx",
    startDate: new Date("2024-05-15"),
    durationDays: 15,
    endDate: new Date("2024-05-30"),
    amountPaid: 15.00,
    paymentProof: undefined,
    createdAt: new Date("2024-05-15"),
    observations: "",
    status: 'expired'
  },
  {
    id: "3",
    playerName: "TANK_MASTER_2024",
    startDate: new Date("2024-06-01"),
    durationDays: 60,
    endDate: new Date("2024-08-01"),
    amountPaid: 50.00,
    paymentProof: undefined,
    createdAt: new Date("2024-06-01"),
    observations: "VIP de longa duração - Cliente premium",
    status: 'active'
  },
  {
    id: "4",
    playerName: "BF4_LEGEND_BR",
    startDate: new Date("2024-06-05"),
    durationDays: 30,
    endDate: new Date("2024-07-05"),
    amountPaid: 30.00,
    paymentProof: undefined,
    createdAt: new Date("2024-06-05"),
    observations: "Pagamento via transferência bancária",
    status: 'active'
  },
  {
    id: "5",
    playerName: "NOOB_KILLER_99",
    startDate: new Date("2024-06-08"),
    durationDays: 7,
    endDate: new Date("2024-06-15"),
    amountPaid: 10.00,
    paymentProof: undefined,
    createdAt: new Date("2024-06-08"),
    observations: "",
    status: 'expired'
  }
];

// Recalcula o status baseado na data atual
export const getVipsWithCurrentStatus = (): VIP[] => {
  return mockVips.map(vip => {
    const now = new Date();
    const endDate = new Date(vip.endDate);
    const status = endDate >= now ? 'active' : 'expired';
    
    return { ...vip, status };
  });
};
