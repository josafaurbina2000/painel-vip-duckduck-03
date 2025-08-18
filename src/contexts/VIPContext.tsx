
import React, { createContext, useContext, ReactNode } from 'react';
import { VIP } from '@/types/vip';
import { useVIPs } from '@/hooks/useVIPs';
import { useAuth } from '@/contexts/AuthContext';

interface VIPContextType {
  vips: VIP[];
  isLoading: boolean;
  user: any;
  addVIP: (vip: Omit<VIP, 'id' | 'status'>) => Promise<VIP>;
  updateVIP: (id: string, updates: Partial<VIP>) => Promise<VIP>;
  deleteVIP: (id: string) => Promise<void>;
  getVIPById: (id: string) => VIP | undefined;
  clearAllData: () => Promise<void>;
  refetch: () => Promise<void>;
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
  const { user } = useAuth();
  const vipHook = useVIPs();

  return (
    <VIPContext.Provider value={vipHook}>
      {children}
    </VIPContext.Provider>
  );
};
