
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

export const checkPWADisplayMode = () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
  const isInStandaloneMode = 'standalone' in (window.navigator as any) && (window.navigator as any).standalone;
  
  return isStandalone || (isIOS && isInStandaloneMode);
};

export const addToHomeScreenPrompt = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode = 'standalone' in (window.navigator as any) && (window.navigator as any).standalone;
  
  if (isIOS && !isInStandaloneMode) {
    return {
      canInstall: true,
      platform: 'ios',
      message: 'Para instalar este app no seu iPhone/iPad, toque no ícone de compartilhar e selecione "Adicionar à Tela Inicial".'
    };
  }
  
  return {
    canInstall: false,
    platform: 'unknown',
    message: ''
  };
};
