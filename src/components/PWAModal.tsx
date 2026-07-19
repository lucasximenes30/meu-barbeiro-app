'use client';

import { useEffect, useState } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Download, X, Share } from 'lucide-react';

export function PWAModal() {
  const { isInstallable, isIOS, isStandalone, promptInstall } = usePWA();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isStandalone) return;
    
    // Check local storage for preference
    const declined = localStorage.getItem('pwa_declined');
    if (declined) return;

    // Show if android is installable OR if it is iOS (which doesn't fire install prompt but we want to show instructions)
    if (isInstallable || isIOS) {
      // Small delay to not be aggressive
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isIOS, isStandalone]);

  const handleDecline = () => {
    localStorage.setItem('pwa_declined', 'true');
    setShow(false);
  };

  const handleInstall = () => {
    if (isInstallable) {
      promptInstall();
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 pb-8 sm:p-0 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-card border border-white/10 rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300">
        <button 
          onClick={handleDecline}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-4">
          <Download className="w-6 h-6" />
        </div>
        
        <h3 className="text-xl font-bold mb-2">Instalar Aplicativo</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Instale o Meu Barbeiro App para uma experiência mais fluida, acesso rápido e Notificações no celular.
        </p>

        {isIOS ? (
          <div className="bg-secondary/50 p-4 rounded-2xl border border-white/5 mb-6 text-sm text-muted-foreground">
            <p className="flex items-center gap-2 mb-2">
              <Share className="w-4 h-4" /> 1. Toque em <strong>Compartilhar</strong>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-4 h-4 flex items-center justify-center border border-current rounded text-[10px]">+</span> 2. Adicionar à <strong>Tela de Início</strong>
            </p>
          </div>
        ) : null}

        <div className="space-y-3">
          {!isIOS && (
            <Button onClick={handleInstall} className="w-full py-6 text-base font-medium btn-premium">
              Instalar Agora
            </Button>
          )}
          <Button onClick={handleDecline} variant="ghost" className="w-full text-muted-foreground">
            Agora não
          </Button>
        </div>
      </div>
    </div>
  );
}
