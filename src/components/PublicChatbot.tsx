'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, ArrowLeft, MoreVertical, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ServiceSelector } from './ServiceSelector';
import { DateTimeSelector } from './DateTimeSelector';

interface PublicChatbotProps {
  barbershop: {
    id: string;
    name: string;
    phone: string | null;
    logoUrl: string | null;
    welcomeMessage: string;
    services?: { id: string; name: string; price: number; duration: number }[];
    products?: { id: string; name: string; price: number }[];
  };
}

interface Message {
  id?: string;
  sender: 'bot' | 'client' | 'barber';
  text: string;
  time: string;
  options?: string[];
  isServiceSelector?: boolean;
  isDateTimeSelector?: boolean;
  actionButton?: {
    text: string;
    url: string;
  };
}

type ChatState = 'WELCOME' | 'ASK_NAME' | 'ASK_PHONE' | 'ASK_SERVICE' | 'ASK_DATE_TIME' | 'ASK_PRODUCT' | 'CONFIRM' | 'DONE';

export function PublicChatbot({ barbershop }: PublicChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'bot', 
      text: 'Olá! Seja bem-vindo. Escolha uma opção para continuar:', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: ['Iniciar Atendimento', 'Falar no WhatsApp']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatState, setChatState] = useState<ChatState>('WELCOME');
  const [clientData, setClientData] = useState({ name: '', phone: '', serviceId: '', serviceName: '', date: '', time: '', productId: '', productName: '' });
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Polling para escutar mensagens do barbeiro
  useEffect(() => {
    if (!conversationId) return;

    const pollMessages = async () => {
      try {
        const res = await fetch(`/api/public/chat/${barbershop.id}/poll?conversationId=${conversationId}`);
        const data = await res.json();
        
        if (data.success && data.messages) {
          setMessages(prev => {
            let hasNew = false;
            const newMessages = [...prev];
            
            for (const msg of data.messages) {
              // Verifica se a mensagem (pelo ID) já está no estado
              const exists = newMessages.find(m => m.id === msg.id);
              if (!exists) {
                newMessages.push(msg);
                hasNew = true;
              }
            }
            
            return hasNew ? newMessages : prev;
          });
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    };

    const interval = setInterval(pollMessages, 3000);
    return () => clearInterval(interval);
  }, [conversationId, barbershop.id]);

  // Sincroniza mensagem com o backend (Inbox)
  const syncMessage = async (text: string, sender: 'bot' | 'client', currentConvId: string | null, clientName: string, clientPhone: string) => {
    try {
      const res = await fetch(`/api/public/chat/${barbershop.id}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConvId,
          clientName,
          clientPhone,
          text,
          sender
        })
      });
      const data = await res.json();
      if (data.success && data.conversationId) {
        setConversationId(data.conversationId);
        return data.conversationId;
      }
    } catch (e) {
      console.error('Sync error:', e);
    }
    return currentConvId;
  };

  // Finaliza agendamento no backend
  const bookAppointment = async () => {
    try {
      await fetch(`/api/public/chat/${barbershop.id}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          ...clientData
        })
      });
    } catch (e) {
      console.error('Book error:', e);
    }
  };

  const handleSendDateTime = async (date: string, time: string) => {
    const text = `${date} às ${time}`;
    const newMsg: Message = {
      sender: 'client',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    let updatedConvId = await syncMessage(text, 'client', conversationId, clientData.name || text, clientData.phone);
    
    const updatedClientData = { ...clientData, date, time };
    setClientData(updatedClientData);
    
    setTimeout(async () => {
      let botResponse = '';
      let botOptions: string[] | undefined = undefined;
      let nextState: ChatState = chatState;

      if (barbershop.products && barbershop.products.length > 0) {
        botResponse = `Temos os seguintes produtos disponíveis na barbearia. Deseja adicionar algum ao seu atendimento?`;
        botOptions = [...barbershop.products.map(p => p.name), 'Não, obrigado'];
        nextState = 'ASK_PRODUCT';
      } else {
        botResponse = `Perfeito! Confirmando seu agendamento:\nServiço: ${updatedClientData.serviceName}\nData: ${updatedClientData.date}\nHorário: ${updatedClientData.time}\n\nTudo certo?`;
        botOptions = ['Sim', 'Não'];
        nextState = 'CONFIRM';
      }

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse, options: botOptions, time: timeStr }]);
      setChatState(nextState);
      setIsTyping(false);
      
      await syncMessage(botResponse, 'bot', updatedConvId, updatedClientData.name, updatedClientData.phone);
    }, 1000);
  };

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    const newMsg: Message = {
      sender: 'client',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    let updatedConvId = await syncMessage(text, 'client', conversationId, clientData.name || text, clientData.phone);

    // Processamento do estado
    setTimeout(async () => {
      let botResponse = '';
      let botOptions: string[] | undefined = undefined;
      let isServiceSelector: boolean | undefined = undefined;
      let isDateTimeSelector: boolean | undefined = undefined;
      let actionButton: Message['actionButton'] = undefined;
      let nextState = chatState;
      let currentClientData = { ...clientData };

      switch (chatState) {
        case 'WELCOME':
          if (text === 'Iniciar Atendimento') {
            botResponse = 'Ótimo! Para começarmos, qual o seu nome?';
            nextState = 'ASK_NAME';
          } else if (text === 'Falar no WhatsApp') {
            botResponse = 'Clique no botão abaixo para ser redirecionado ao nosso WhatsApp.';
            const phoneOnlyNumbers = barbershop.phone ? barbershop.phone.replace(/\D/g, '') : '';
            actionButton = {
              text: 'Falar no WhatsApp',
              url: `https://wa.me/${phoneOnlyNumbers}?text=Ol%C3%A1%2C%20preciso%20de%20ajuda!`
            };
            nextState = 'DONE';
          } else {
            botResponse = 'Por favor, escolha uma das opções acima.';
            botOptions = ['Iniciar Atendimento', 'Falar no WhatsApp'];
            nextState = 'WELCOME';
          }
          break;
        case 'ASK_NAME':
          currentClientData.name = text;
          setClientData(currentClientData);
          botResponse = `Prazer em te conhecer, ${text}! Qual o seu telefone (WhatsApp)?`;
          nextState = 'ASK_PHONE';
          break;
        case 'ASK_PHONE':
          currentClientData.phone = text;
          setClientData(currentClientData);
          botResponse = `Obrigado! Qual serviço você deseja agendar?`;
          isServiceSelector = true;
          nextState = 'ASK_SERVICE';
          break;
        case 'ASK_SERVICE':
          currentClientData.serviceName = text;
          const matchedService = barbershop.services?.find(s => s.name === text);
          if (matchedService) currentClientData.serviceId = matchedService.id;
          setClientData(currentClientData);
          botResponse = `Certo, ${text}. Para qual dia e horário?`;
          
          isDateTimeSelector = true;
          nextState = 'ASK_DATE_TIME';
          break;
        case 'ASK_DATE_TIME':
          // Handled by handleSendDateTime
          break;
        case 'ASK_PRODUCT':
          if (text !== 'Não, obrigado') {
            currentClientData.productName = text;
            const matchedProduct = barbershop.products?.find(p => p.name === text);
            if (matchedProduct) currentClientData.productId = matchedProduct.id;
          }
          setClientData(currentClientData);
          
          let confirmationText = `Perfeito! Confirmando seu agendamento:\nServiço: ${currentClientData.serviceName}\nData: ${currentClientData.date}\nHorário: ${currentClientData.time}`;
          if (currentClientData.productName) confirmationText += `\nProduto: ${currentClientData.productName}`;
          confirmationText += `\n\nTudo certo?`;
          
          botResponse = confirmationText;
          botOptions = ['Sim', 'Não'];
          nextState = 'CONFIRM';
          break;
        case 'CONFIRM':
          if (text.toLowerCase().includes('sim')) {
            botResponse = 'Agendamento confirmado! Te esperamos lá.';
            nextState = 'DONE';
            await bookAppointment();
            
            if (barbershop.phone) {
              const phoneOnlyNumbers = barbershop.phone.replace(/\D/g, '');
              const encodedMessage = encodeURIComponent(`Olá, me chamo ${currentClientData.name}, para o dia ${currentClientData.date} às ${currentClientData.time} e estou com uma dúvida.`);
              actionButton = {
                text: 'Caso tenha alguma dúvida',
                url: `https://wa.me/${phoneOnlyNumbers}?text=${encodedMessage}`
              };
            }
          } else {
            botResponse = 'Ok, vamos recomeçar. Qual serviço você deseja?';
            isServiceSelector = true;
            nextState = 'ASK_SERVICE';
          }
          break;
        case 'DONE':
          botResponse = 'Seu agendamento já está confirmado. Se precisar de mais alguma coisa, basta falar!';
          break;
      }
      
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse, options: botOptions, isServiceSelector, isDateTimeSelector, actionButton, time: timeStr }]);
      setChatState(nextState);
      setIsTyping(false);
      
      // Sincroniza a resposta do bot
      await syncMessage(botResponse, 'bot', updatedConvId, currentClientData.name, currentClientData.phone);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-full bg-black text-white relative shadow-2xl">
      
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-black to-black opacity-60"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            {barbershop.logoUrl ? (
              <img src={barbershop.logoUrl} alt={barbershop.name} className="w-11 h-11 rounded-full object-cover border border-white/10" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
                {barbershop.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full"></div>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">{barbershop.name}</h1>
            <p className="text-xs text-primary/80 font-medium">Atendimento Digital ⚡</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-zinc-400">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide z-10">
        <div className="flex justify-center my-6">
          <span className="text-[10px] font-medium bg-white/5 text-zinc-400 px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md border border-white/10">
            Início do Atendimento
          </span>
        </div>

        {messages.map((msg, index) => {
          const isBot = msg.sender === 'bot';
          
          return (
            <div key={index} className={`flex flex-col ${!isBot ? 'items-end' : 'items-start'} gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex items-end gap-2 max-w-[85%] ${!isBot ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {isBot && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 bg-zinc-900/80 shadow-md">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div 
                    className={`p-4 shadow-xl text-[15px] leading-relaxed relative ${
                      !isBot 
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm' 
                        : 'bg-zinc-900/80 border border-white/5 text-zinc-200 rounded-2xl rounded-bl-sm backdrop-blur-md'
                    }`}
                  >
                    {msg.text}
                    <div className={`text-[9px] mt-1.5 text-right font-medium tracking-wide ${!isBot ? 'text-primary-foreground/70' : 'text-zinc-500'}`}>
                      {msg.time}
                    </div>
                  </div>
                  
                  {msg.options && index === messages.length - 1 && !isTyping && !msg.isServiceSelector && !msg.isDateTimeSelector && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.options.map((option, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleSend(option)}
                          className="px-4 py-2 text-[13px] bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full transition-colors font-medium whitespace-nowrap"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.isServiceSelector && index === messages.length - 1 && !isTyping && barbershop.services && (
                    <ServiceSelector 
                      services={barbershop.services} 
                      onSelect={(serviceName) => handleSend(serviceName)} 
                    />
                  )}

                  {msg.isDateTimeSelector && index === messages.length - 1 && !isTyping && (
                    <DateTimeSelector 
                      onSelect={handleSendDateTime}
                    />
                  )}

                  {msg.actionButton && index === messages.length - 1 && !isTyping && (
                    <div className="mt-2">
                      <a 
                        href={msg.actionButton.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-black font-bold rounded-xl transition-colors shadow-lg shadow-green-500/20"
                      >
                        <Phone className="w-4 h-4" />
                        {msg.actionButton.text}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-end gap-2 animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-full bg-zinc-900/80 flex items-center justify-center shrink-0 border border-white/5 shadow-md">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-zinc-900/80 border border-white/5 p-4 rounded-2xl rounded-bl-sm w-16 flex items-center justify-center gap-1.5 backdrop-blur-md shadow-xl">
              <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/80 backdrop-blur-2xl border-t border-white/10 z-10 pb-safe">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center gap-2"
        >
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escreva sua mensagem..."
            className="flex-1 h-14 bg-zinc-900/50 border-white/10 rounded-full px-5 text-[15px] text-white focus-visible:ring-1 focus-visible:ring-primary/50 shadow-inner"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputText.trim()}
            className="shrink-0 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-transform active:scale-95 disabled:opacity-50"
          >
            <Send className="w-5 h-5 text-primary-foreground ml-1" />
          </Button>
        </form>
        <p className="text-[10px] text-center text-zinc-600 mt-4 font-medium uppercase tracking-widest">
          Atendimento automatizado por <span className="text-primary/70">IA</span>
        </p>
      </div>
    </div>
  );
}
