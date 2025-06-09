
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VIP } from '@/types/vip';
import { mockVips } from '@/data/mockVips';
import { calculateVIPStatus } from '@/utils/vipUtils';

interface VIPContextType {
  vips: VIP[];
  addVIP: (vip: Omit<VIP, 'id' | 'status'>) => void;
  updateVIP: (id: string, updates: Partial<VIP>) => void;
  deleteVIP: (id: string) => void;
  getVIPById: (id: string) => VIP | undefined;
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

  // Carregar dados do localStorage ou usar mock data
  useEffect(() => {
    const savedVips = localStorage.getItem('vips');
    if (savedVips) {
      const parsedVips = JSON.parse(savedVips);
      // Converter strings de data de volta para objetos Date e migrar dados antigos
      const vipsWithDates = parsedVips.map((vip: any) => ({
        ...vip,
        startDate: new Date(vip.startDate),
        endDate: new Date(vip.endDate),
        createdAt: new Date(vip.createdAt),
        // Remover propriedades de VIP permanente se existirem
        isPermanent: undefined,
        paymentProof: typeof vip.paymentProof === 'string' && vip.paymentProof 
          ? null 
          : vip.paymentProof
      }));
      setVips(vipsWithDates);
    } else {
      setVips(mockVips);
    }
  }, []);

  // Salvar no localStorage sempre que os VIPs mudarem
  useEffect(() => {
    if (vips.length > 0) {
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

  const value: VIPContextType = {
    vips: getVipsWithCurrentStatus(),
    addVIP,
    updateVIP,
    deleteVIP,
    getVIPById
  };

  return (
    <VIPContext.Provider value={value}>
      {children}
    </VIPContext.Provider>
  );
};
