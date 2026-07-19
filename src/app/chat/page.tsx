'use client';

import { Bot, User, CheckCircle2, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ChatPage() {
  // Mock data to simulate the inbox of bot conversations
  const conversations = [
    {
      id: 1,
      clientName: 'João Silva',
      lastMessage: 'Agendamento confirmado para amanhã às 14:00.',
      time: 'Agora mesmo',
      status: 'resolved', // Bot finished booking
      unread: true
    },
    {
      id: 2,
      clientName: 'Marcos Paulo',
      lastMessage: 'Gostaria de saber o valor do corte degradê.',
      time: '10 min',
      status: 'active', // Bot is currently talking
      unread: false
    },
    {
      id: 3,
      clientName: 'Felipe Almeida',
      lastMessage: 'Agendamento confirmado para sábado às 09:30.',
      time: '1 hora',
      status: 'resolved',
      unread: false
    },
    {
      id: 4,
      clientName: 'Rafael Costa',
      lastMessage: 'Ok, vou olhar os produtos na vitrine.',
      time: 'Ontem',
      status: 'resolved',
      unread: false
    }
  ];

  return (
    <div className="space-y-6 p-4 pt-8">
      
      {/* Header */}
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
      <div className="space-y-3">
        {conversations.map((chat) => (
          <div 
            key={chat.id} 
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
