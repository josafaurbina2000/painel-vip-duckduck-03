
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VIP } from '@/types/vip';
import { calculateVIPStatus } from '@/utils/vipUtils';

interface VIPContextType {
  vips: VIP[];
  addVIP: (vip: Omit<VIP, 'id' | 'status'>) => void;
  updateVIP: (id: string, updates: Partial<VIP>) => void;
  deleteVIP: (id: string) => void;
  getVIPById: (id: string) => VIP | undefined;
  clearAllData: () => void;
}

const VIPContext = createContext<VIPContextType | undefined>(undefined);

export const useVIP = () => {
  const context = useContext(VIPContext);
  if (!context) {
    throw new Error('useVIP must be used within a VIPProvider');
  }
  return context;
};

interface VIPProviderProps {
  children: ReactNode;
}

export const VIPProvider: React.FC<VIPProviderProps> = ({ children }) => {
  const [vips, setVips] = useState<VIP[]>([]);

  // Carregar dados do localStorage - SEM fallback para mock data
  useEffect(() => {
    const savedVips = localStorage.getItem('vips');
    if (savedVips) {
      try {
        const parsedVips = JSON.parse(savedVips);
        // Converter strings de data de volta para objetos Date
        const vipsWithDates = parsedVips.map((vip: any) => ({
          ...vip,
          startDate: new Date(vip.startDate),
          endDate: new Date(vip.endDate),
          createdAt: new Date(vip.createdAt),
          // Limpar propriedades desnecessárias
          isPermanent: undefined,
          paymentProof: typeof vip.paymentProof === 'string' && vip.paymentProof 
            ? null 
            : vip.paymentProof
        }));
        setVips(vipsWithDates);
      } catch (error) {
        console.error('Erro ao carregar VIPs do localStorage:', error);
        setVips([]);
      }
    } else {
      // Inicializar com array vazio - PRONTO PARA SUPABASE
      setVips([]);
    }
  }, []);

  // Salvar no localStorage sempre que os VIPs mudarem
  useEffect(() => {
    if (vips.length >= 0) { // Salvar mesmo quando array está vazio
      localStorage.setItem('vips', JSON.stringify(vips));
    }
  }, [vips]);

  // Recalcular status dos VIPs baseado na data atual
  const getVipsWithCurrentStatus = () => {
    return vips.map(vip => ({
      ...vip,
      status: calculateVIPStatus(vip)
    }));
  };

  const addVIP = (newVipData: Omit<VIP, 'id' | 'status'>) => {
    const newVip: VIP = {
      ...newVipData,
      id: Date.now().toString(),
      status: calculateVIPStatus(newVipData as VIP)
    };
    
    setVips(prevVips => [...prevVips, newVip]);
  };

  const updateVIP = (id: string, updates: Partial<VIP>) => {
    setVips(prevVips =>
      prevVips.map(vip =>
        vip.id === id 
          ? { ...vip, ...updates, status: calculateVIPStatus({ ...vip, ...updates } as VIP) }
          : vip
      )
    );
  };

  const deleteVIP = (id: string) => {
    setVips(prevVips => prevVips.filter(vip => vip.id !== id));
  };

  const getVIPById = (id: string) => {
    const vipsWithStatus = getVipsWithCurrentStatus();
    return vipsWithStatus.find(vip => vip.id === id);
  };

  // Função para limpar todos os dados - PRONTA PARA RESET COMPLETO
  const clearAllData = () => {
    setVips([]);
    localStorage.removeItem('vips');
    console.log('Todos os dados foram limpos. Sistema pronto para Supabase.');
  };

  const value: VIPContextType = {
    vips: getVipsWithCurrentStatus(),
    addVIP,
    updateVIP,
    deleteVIP,
    getVIPById,
    clearAllData
  };

  return (
    <VIPContext.Provider value={value}>
      {children}
    </VIPContext.Provider>
  );
};
