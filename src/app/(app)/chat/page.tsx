'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, User, CheckCircle2, Clock, Search, ArrowLeft, Send, MoreVertical, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getConversations } from '@/app/actions/chat';

type MessageFormat = {
  type?: 'date' | 'system' | 'typing';
  sender?: 'bot' | 'client' | 'barber';
  text?: string;
  time?: string;
};

type ConversationFormat = {
  id: string;
  clientName: string;
  lastMessage: string;
  time: string;
  status: string;
  unread: boolean;
  messages: MessageFormat[];
};

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationFormat[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedChatId) {
      scrollToBottom();
    }
  }, [selectedChatId, conversations]);

  const loadConversations = async () => {
    const res = await getConversations();
    if (res.success && res.data) {
      const formatted = res.data.map(conv => {
        // Format time logic (simplified for UI)
        const date = new Date(conv.updatedAt);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Formata as mensagens do banco
        const msgs: MessageFormat[] = conv.messages.map(m => ({
          sender: m.sender as any,
          text: m.text,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        
        const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1].text : '';

        return {
          id: conv.id,
          clientName: conv.clientName,
          lastMessage: lastMsg || '',
          time: timeStr,
          status: conv.status,
          unread: conv.unread,
          messages: msgs
        };
      });
      setConversations(formatted);
    }
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 3000);
    return () => clearInterval(interval);
  }, []);

  const selectedChat = conversations.find(c => c.id === selectedChatId);

  if (selectedChat) {
    return (
      <div className="flex flex-col h-[calc(100vh-80px)] bg-background">
        {/* Header da conversa detalhada */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-secondary/20 sticky top-0 z-10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedChatId(null)} className="shrink-0 -ml-2 hover:bg-white/5 rounded-full">
              <ArrowLeft className="w-5 h-5 text-zinc-300" />
            </Button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-lg shadow-primary/20">
                {selectedChat.clientName.substring(0, 2).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base truncate leading-tight">{selectedChat.clientName}</h3>
              <p className="text-xs text-primary/80 font-medium truncate">
                {selectedChat.status === 'active' ? 'Robô digitando...' : selectedChat.status === 'human' ? 'Atendimento manual' : 'Finalizado'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-muted-foreground">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-muted-foreground">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Lista de mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
          {selectedChat.messages.map((msg, index) => {
            if (msg.type === 'date') {
              return (
                <div key={index} className="flex justify-center my-4">
                  <span className="text-[10px] font-medium bg-secondary/40 text-muted-foreground px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/5">
                    {msg.text}
                  </span>
                </div>
              );
            }

            if (msg.type === 'system') {
              return (
                <div key={index} className="flex justify-center my-4">
                  <span className="text-[11px] bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-xl font-medium shadow-sm">
                    {msg.text}
                  </span>
                </div>
              );
            }

            if (msg.type === 'typing') {
              return (
                <div key={index} className="flex items-end gap-2 my-2">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-white/5">
                    <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="bg-secondary/40 border border-white/5 p-3.5 rounded-2xl rounded-bl-sm w-16 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"></span>
                  </div>
                </div>
              );
            }

            const isMe = msg.sender === 'barber';
            const isBot = msg.sender === 'bot';
            
            return (
              <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-1`}>
                <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar lateral (só para quem não sou "Eu") */}
                  {!isMe && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-white/5 ${isBot ? 'bg-secondary' : 'bg-zinc-800'}`}>
                      {isBot ? <Bot className="w-3.5 h-3.5 text-muted-foreground" /> : <User className="w-3.5 h-3.5 text-zinc-400" />}
                    </div>
                  )}

                  <div 
                    className={`p-3.5 shadow-sm text-[14px] leading-relaxed relative group ${
                      isMe 
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm' 
                        : 'bg-secondary/40 border border-white/5 text-zinc-200 rounded-2xl rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                    
                    {/* Timestamp na própria bolha */}
                    <div className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {msg.time}
                      {isMe && <CheckCircle2 className="w-3 h-3 text-primary-foreground/70" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input simulado */}
        <div className="p-4 bg-background/80 backdrop-blur-xl border-t border-white/5 sticky bottom-0 pb-safe">
          <div className="relative max-w-3xl mx-auto flex items-center gap-2">
            <Input
              placeholder="Digite uma mensagem para o cliente..."
              className="flex-1 h-12 bg-secondary/30 border-white/10 rounded-full px-5 text-sm focus-visible:ring-1 focus-visible:ring-primary/50"
            />
            <Button size="icon" className="shrink-0 h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Send className="w-5 h-5 text-primary-foreground ml-1" />
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-3 font-medium">
            Ao enviar, o robô de IA é <span className="text-primary">pausado automaticamente</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 pt-8">
      
      {/* Header da lista */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Caixa de Entrada</h2>
        <p className="text-muted-foreground text-sm">Histórico de agendamentos e conversas do Robô.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar cliente..."
          className="pl-10 h-12 rounded-2xl bg-secondary/20 border-white/10"
        />
      </div>

      {/* Inbox List */}
      <div className="space-y-3 pb-24">
        {conversations.map((chat) => (
          <div 
            key={chat.id}
            onClick={() => setSelectedChatId(chat.id)}
            className={`p-4 rounded-3xl border flex gap-4 cursor-pointer hover:bg-white/5 transition-colors ${
              chat.unread 
                ? 'bg-secondary/40 border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                : 'bg-secondary/10 border-white/5'
            }`}
          >
            
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                {chat.clientName.substring(0, 2).toUpperCase()}
              </div>
              {chat.status === 'active' ? (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary border-2 border-background flex items-center justify-center">
                  <Bot className="w-3 h-3 text-muted-foreground" />
                </div>
              ) : (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-foreground border-2 border-background flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-background" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className={`font-bold truncate pr-2 ${chat.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {chat.clientName}
                </h4>
                <span className="text-[10px] text-muted-foreground shrink-0">{chat.time}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <p className={`text-xs truncate ${chat.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {chat.lastMessage}
                </p>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                {chat.status === 'active' ? (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                    <Clock className="w-2.5 h-2.5" /> EM ANDAMENTO
                  </span>
                ) : (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-2.5 h-2.5" /> FINALIZADO PELO ROBÔ
                  </span>
                )}
              </div>
            </div>
            
            {/* Unread dot */}
            {chat.unread && (
              <div className="flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
            )}
            
          </div>
        ))}
      </div>
      
    </div>
  );
}
