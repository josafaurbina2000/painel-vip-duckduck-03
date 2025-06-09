
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

  // Forçar limpeza completa na inicialização - PREPARAÇÃO PARA SUPABASE
  useEffect(() => {
    // Limpar localStorage automaticamente para garantir início limpo
    localStorage.removeItem('vips');
    console.log('Sistema inicializado limpo - pronto para integração Supabase');
    setVips([]);
  }, []);

  // Salvar no localStorage sempre que os VIPs mudarem (apenas se houver dados)
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

  // Função para limpar todos os dados - PREPARAÇÃO COMPLETA PARA SUPABASE
  const clearAllData = () => {
    setVips([]);
    localStorage.removeItem('vips');
    localStorage.clear(); // Limpa todo o localStorage para garantia
    console.log('LIMPEZA COMPLETA: Todos os dados foram removidos. Sistema 100% limpo para Supabase.');
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
