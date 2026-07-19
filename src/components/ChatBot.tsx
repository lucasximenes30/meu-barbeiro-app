'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Scissors, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
  isOptions?: boolean;
  options?: { label: string; value: string }[];
}

export function ChatBot({ barbershopId, barbershopName }: { barbershopId: string, barbershopName: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'bot', text: `Olá, tudo bem? Sou a assistente virtual do(a) ${barbershopName} e cuido do agendamento dos serviços, ok? Qual o seu nome? Escreva seu nome e sobrenome, por favor.` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Dados coletados
  const [bookingData, setBookingData] = useState({
    nome: '',
    email: '',
    telefone: '',
    servicoId: '',
    data: '',
    hora: '',
  });

  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Buscar serviços ao iniciar
    fetch('/api/services')
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setServices(res.data);
        }
      });
      
    // Buscar produtos para oferecer no final
    fetch('/api/products')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setProducts(res.data);
        }
      });
  }, []);

  const addBotMessage = (text: string, options?: { label: string; value: string }[]) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'bot',
      text,
      isOptions: !!options,
      options
    }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      text
    }]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');
    addUserMessage(text);
    
    await processStep(text);
  };

  const handleOptionSelect = async (option: { label: string; value: string }) => {
    addUserMessage(option.label);
    await processStep(option.value, option.label);
  };

  const processStep = async (value: string, label?: string) => {
    setIsLoading(true);
    // Simular digitação
    await new Promise(r => setTimeout(r, 600));

    try {
      if (step === 0) {
        if (value.length < 2) {
          addBotMessage('Por favor, digite um nome válido para continuarmos:');
          return;
        }
        setBookingData(prev => ({ ...prev, nome: value }));
        addBotMessage(`Prazer, ${value}! Por favor, digite o seu melhor e-mail (usaremos para te enviar um lembrete).`);
        setStep(1);
      } 
      else if (step === 1) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          addBotMessage('Hmm, esse e-mail não parece certo. Por favor, digite um e-mail válido (ex: seu.nome@email.com):');
          return;
        }
        setBookingData(prev => ({ ...prev, email: value }));
        addBotMessage('Ótimo! E qual é o seu telefone/WhatsApp? (apenas números, ex: 11999999999)');
        setStep(2);
      }
      else if (step === 2) {
        const apenasNumeros = value.replace(/\D/g, '');
        // Validação estrita para números brasileiros:
        // - Deve ter 10 (fixo) ou 11 (celular com 9) dígitos
        // - O DDD (primeiros 2 dígitos) não pode começar com 0
        const phoneRegex = /^[1-9]{2}(?:[2-8]|9\d)\d{7}$/;

        if (!phoneRegex.test(apenasNumeros)) {
          addBotMessage('Esse número não parece ser um celular ou telefone válido. Por favor, digite um número real com o DDD (ex: 11999999999):');
          return;
        }
        setBookingData(prev => ({ ...prev, telefone: apenasNumeros }));
        
        const serviceOptions = services.map(s => ({
          label: `${s.name} - R$${Number(s.price).toFixed(2)}`,
          value: s.id
        }));
        
        addBotMessage('Perfeito! Qual serviço você deseja agendar hoje?', serviceOptions);
        setStep(3);
      }
      else if (step === 3) {
        setBookingData(prev => ({ ...prev, servicoId: value }));
        
        // Gerar próximos 5 dias como opções
        const dates = [];
        for (let i = 0; i < 5; i++) {
          const date = addDays(new Date(), i);
          dates.push({
            label: format(date, "EEEE, dd/MM", { locale: ptBR }),
            value: format(date, 'yyyy-MM-dd')
          });
        }
        
        addBotMessage('Excelente escolha. Para qual dia você prefere?', dates);
        setStep(4);
      }
      else if (step === 4) {
        setBookingData(prev => ({ ...prev, data: value }));
        
        // Simular que aos Domingos não temos horários
        const selectedDate = new Date(value + 'T00:00:00');
        if (selectedDate.getDay() === 0) {
          const dates = [];
          for (let i = 1; i <= 5; i++) {
            const d = addDays(new Date(), i);
            dates.push({
              label: format(d, "EEEE, dd/MM", { locale: ptBR }),
              value: format(d, 'yyyy-MM-dd')
            });
          }
          addBotMessage(`Poxa, estamos fechados ou sem horários para ${label}. Por favor, escolha outra data:`, dates);
          return; // Mantém no step 4
        }
        
        // Aqui vamos simular horários disponíveis
        const times = [
          { label: '09:00', value: '09:00' },
          { label: '10:00', value: '10:00' },
          { label: '14:00', value: '14:00' },
          { label: '15:30', value: '15:30' },
          { label: '17:00', value: '17:00' },
        ];
        
        addBotMessage(`Legal! Estes são os horários disponíveis para ${label}:`, times);
        setStep(5);
      }
      else if (step === 5) {
        setBookingData(prev => ({ ...prev, hora: value }));
        addBotMessage('Confirmando seu agendamento, um momento...');
        setStep(6);
        
        // Finalizar agendamento criando o Cliente e Appointment
        await finalizeBooking(value);
      }
      else if (step === 7) {
        if (value === 'skip') {
          addBotMessage('Sem problemas! Nos vemos no dia do seu agendamento. Até lá!');
        } else {
          // Aqui faríamos a reserva real do produto no DB se necessário
          addBotMessage(`Perfeito! Já deixaremos seu produto (${label}) separado para você retirar no dia. Até logo!`);
        }
        setStep(8);
      }
    } catch (error: unknown) {
      addBotMessage('Desculpe, ocorreu um erro. Vamos tentar novamente?');
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeBooking = async (horaSelecionada: string) => {
    try {
      const payload = {
        ...bookingData,
        hora: horaSelecionada,
        barbershopId
      };
      
      const res = await fetch('/api/appointments/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        addBotMessage('✅ Pronto! Seu agendamento foi confirmado com sucesso. Você receberá um e-mail de lembrete em breve.');
        
        setTimeout(() => {
          const availableProducts = products.filter(p => p.stock > 0);
          if (availableProducts.length > 0) {
            const productOptions = availableProducts.map(p => ({
              label: `${p.name} - R$${Number(p.price).toFixed(2)}`,
              value: p.id
            }));
            productOptions.push({ label: 'Não, obrigado', value: 'skip' });
            
            addBotMessage('💡 Gostaria de já deixar reservado algum produto exclusivo para retirar no dia?', productOptions);
            setStep(7);
          } else {
            addBotMessage('Nos vemos no dia do agendamento. Até logo!');
            setStep(8);
          }
        }, 1000);
      } else {
        throw new Error('Falha');
      }
    } catch {
      addBotMessage('❌ Poxa, não consegui salvar seu agendamento. Pode tentar de novo mais tarde?');
      setStep(8);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] max-h-[80vh] w-full max-w-md mx-auto glass-card overflow-hidden">
      {/* Header */}
      <div className="bg-primary/10 p-4 border-b border-white/5 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-primary leading-tight">Assistente do(a) {barbershopName}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Online 24/7 para você</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${
                msg.type === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                  : 'bg-card border border-white/5 text-card-foreground rounded-tl-sm'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
            
            {msg.isOptions && msg.options && step !== 8 && msg.id === messages[messages.length - 1].id && (
              <div className="flex flex-col gap-2 mt-3 w-full max-w-[85%]">
                {msg.options.map((opt) => (
                  <Button 
                    key={opt.value} 
                    variant="outline" 
                    size="sm"
                    className="justify-start text-left h-auto py-2 px-3 whitespace-normal bg-card hover:bg-primary/10 hover:border-primary/50 text-sm font-medium"
                    onClick={() => handleOptionSelect(opt)}
                    disabled={isLoading}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && step !== 6 && (
          <div className="flex items-start">
            <div className="bg-card border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1">
              <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {step < 3 && (
        <div className="p-3 bg-card border-t border-white/5 shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input 
              placeholder="Digite sua mensagem..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-white/10 focus-visible:ring-primary/50"
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim() || isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
      {(step >= 3 && step < 8 && step !== 7) && (
        <div className="p-3 bg-card border-t border-white/5 text-center text-xs text-muted-foreground shrink-0">
          Selecione uma das opções acima
        </div>
      )}
      {step === 7 && (
        <div className="p-3 bg-card border-t border-white/5 text-center text-xs text-muted-foreground shrink-0">
          Deseja reservar um produto?
        </div>
      )}
      {step === 8 && (
        <div className="p-3 bg-card border-t border-white/5 flex flex-col items-center justify-center text-primary gap-2 shrink-0">
          <CheckCircle2 className="w-6 h-6" />
          <span className="text-sm font-medium">Atendimento finalizado</span>
        </div>
      )}
    </Card>
  );
}
