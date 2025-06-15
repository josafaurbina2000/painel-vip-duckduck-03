
export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

export const isStandalone = (): boolean => {
  // Check if running as PWA
  if (window.matchMedia) {
    return window.matchMedia('(display-mode: standalone)').matches;
  }
  
  // Fallback for iOS Safari
  return (navigator as any).standalone === true;
};

export const canInstallPWA = (): boolean => {
  return !isStandalone();
};
