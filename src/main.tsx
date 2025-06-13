
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from './utils/pwa'

// Registrar Service Worker
registerSW()

// Remover tela de loading após carregamento
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen')
  if (loadingScreen) {
    loadingScreen.classList.add('fade-out')
    setTimeout(() => {
      loadingScreen.remove()
    }, 300)
  }
})

createRoot(document.getElementById("root")!).render(<App />);
