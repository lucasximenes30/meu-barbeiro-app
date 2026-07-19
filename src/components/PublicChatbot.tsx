'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, ArrowLeft, MoreVertical, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PublicChatbotProps {
  barbershop: {
    id: string;
    name: string;
    logoUrl: string | null;
    welcomeMessage: string;
  };
}

interface Message {
  sender: 'bot' | 'client';
  text: string;
  time: string;
}

export function PublicChatbot({ barbershop }: PublicChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: barbershop.welcomeMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg: Message = {
      sender: 'client',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulando resposta do bot
    setTimeout(() => {
      const botResponses = [
        'Para qual dia você prefere o agendamento?',
        'Ótimo! Temos horários disponíveis pela manhã ou tarde. O que fica melhor para você?',
        'Perfeito. Você tem algum barbeiro de preferência?',
        'Infelizmente estamos lotados hoje, mas temos vagas para amanhã. Pode ser?'
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-2xl mx-auto bg-black text-white relative shadow-2xl">
      
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
