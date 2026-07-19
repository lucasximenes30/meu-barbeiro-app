'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BellRing, X, Info } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

import { toast } from 'sonner';

export function NotificationModal() {
  const [show, setShow] = useState(false);
  const { isIOS, isStandalone } = usePWA();

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const declined = localStorage.getItem('push_declined');
    if (declined) return;

    if (Notification.permission === 'default') {
      // Small delay to let the dashboard load first
      const timer = setTimeout(() => setShow(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDecline = () => {
    localStorage.setItem('push_declined', 'true');
    setShow(false);
  };

  const handleAccept = async () => {
    if (isIOS && !isStandalone) {
      // In iOS, if not standalone, we can't request notifications properly yet.
      // We will just close the modal for now, or alert them.
      toast.info('Adicione à Tela de Início', {
        description: 'Para ativar notificações no iPhone, por favor adicione este aplicativo à sua Tela de Início (Compartilhar > Adicionar à Tela de Início) e abra-o por lá.'
      });
      setShow(false);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setShow(false);
        // We could also subscribe to push manager here and send subscription to backend
      } else {
        handleDecline();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 pb-8 sm:p-0 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-card border border-white/10 rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300">
        <button 
          onClick={handleDecline}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-4">
          <BellRing className="w-6 h-6" />
        </div>
        
        <h3 className="text-xl font-bold mb-2">Ativar Notificações?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Seja avisado instantaneamente quando um cliente chegar, realizar um novo agendamento ou enviar mensagem.
        </p>

        {isIOS && !isStandalone ? (
          <div className="bg-secondary/50 p-4 rounded-2xl border border-primary/20 mb-6 text-sm text-muted-foreground flex gap-3 items-start">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p>
              No iPhone, instale o aplicativo na sua tela de início primeiro para conseguir ativar as notificações.
            </p>
          </div>
        ) : null}

        <div className="space-y-3">
          <Button onClick={handleAccept} className="w-full py-6 text-base font-medium btn-premium">
            Sim, me avise
          </Button>
          <Button onClick={handleDecline} variant="ghost" className="w-full text-muted-foreground">
            Nunca perguntar
          </Button>
        </div>
      </div>
    </div>
  );
}
