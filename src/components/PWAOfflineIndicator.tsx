
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi } from 'lucide-react';

const PWAOfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <Badge 
      variant="destructive" 
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2"
    >
      <WifiOff className="w-4 h-4" />
      Modo Offline
    </Badge>
  );
};

export default PWAOfflineIndicator;
