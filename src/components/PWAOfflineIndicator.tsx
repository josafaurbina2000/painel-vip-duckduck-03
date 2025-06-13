
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi } from 'lucide-react';

const PWAOfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showOfflineMessage) return null;

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50">
      <Badge 
        variant={isOnline ? "default" : "destructive"} 
        className="flex items-center gap-2 px-3 py-1"
      >
        {isOnline ? (
          <>
            <Wifi className="w-3 h-3" />
            Conectado
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            Modo Offline
          </>
        )}
      </Badge>
    </div>
  );
};

export default PWAOfflineIndicator;
