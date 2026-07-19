'use client';

import { useState } from 'react';
import { Bot, User, CheckCircle2, Clock, Search, ArrowLeft, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  // Mock data to simulate the inbox of bot conversations
  const conversations = [
    {
      id: 1,
      clientName: 'João Silva',
      lastMessage: 'Agendamento confirmado para amanhã às 14:00.',
      time: 'Agora mesmo',
      status: 'resolved', // Bot finished booking
      unread: true,
      messages: [
        { sender: 'bot', text: 'Olá! Sou o assistente virtual. Como posso ajudar?', time: '13:50' },
        { sender: 'user', text: 'Quero agendar um corte para amanhã.', time: '13:52' },
        { sender: 'bot', text: 'Temos horários às 14:00 e 16:00. Qual prefere?', time: '13:52' },
        { sender: 'user', text: '14:00', time: '13:55' },
        { sender: 'bot', text: 'Agendamento confirmado para amanhã às 14:00. Te esperamos lá!', time: '13:56' },
      ]
    },
    {
      id: 2,
      clientName: 'Marcos Paulo',
      lastMessage: 'Gostaria de saber o valor do corte degradê.',
      time: '10 min',
      status: 'active', // Bot is currently talking
      unread: false,
      messages: [
        { sender: 'bot', text: 'Olá, Marcos! Tudo bem?', time: '14:10' },
        { sender: 'user', text: 'Gostaria de saber o valor do corte degradê.', time: '14:15' },
      ]
    },
    {
      id: 3,
      clientName: 'Felipe Almeida',
      lastMessage: 'Agendamento confirmado para sábado às 09:30.',
      time: '1 hora',
      status: 'resolved',
      unread: false,
      messages: [
        { sender: 'user', text: 'Tem horário sábado cedo?', time: '09:00' },
        { sender: 'bot', text: 'Sim, o primeiro é às 09:30.', time: '09:01' },
        { sender: 'user', text: 'Pode marcar.', time: '09:10' },
        { sender: 'bot', text: 'Agendamento confirmado para sábado às 09:30.', time: '09:10' },
      ]
    },
    {
      id: 4,
      clientName: 'Rafael Costa',
      lastMessage: 'Ok, vou olhar os produtos na vitrine.',
      time: 'Ontem',
      status: 'resolved',
      unread: false,
      messages: [
        { sender: 'user', text: 'Vocês vendem pomada?', time: '10:00' },
        { sender: 'bot', text: 'Sim! Temos várias opções. Você pode conferir na nossa vitrine no app.', time: '10:05' },
        { sender: 'user', text: 'Ok, vou olhar os produtos na vitrine.', time: '10:15' },
      ]
    }
  ];

  const selectedChat = conversations.find(c => c.id === selectedChatId);

  if (selectedChat) {
    return (
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Header da conversa detalhada */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-secondary/10 sticky top-0 z-10 backdrop-blur-md">
          <Button variant="ghost" size="icon" onClick={() => setSelectedChatId(null)} className="shrink-0 -ml-2 hover:bg-white/5">
            <ArrowLeft className="w-5 h-5 text-zinc-300" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
            {selectedChat.clientName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate">{selectedChat.clientName}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {selectedChat.status === 'active' ? 'Interagindo com o robô...' : 'Atendimento finalizado'}
            </p>
          </div>
        </div>

        {/* Lista de mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedChat.messages.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-zinc-800 text-white rounded-tr-sm border border-zinc-700' 
                    : 'bg-primary text-primary-foreground rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 mx-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Input simulado */}
        <div className="p-4 border-t border-white/10 bg-background sticky bottom-0">
          <div className="relative">
            <Input
              placeholder="Assumir o controle e enviar mensagem..."
              className="pr-12 h-12 bg-secondary/20 border-white/10 rounded-full"
            />
            <Button size="icon" className="absolute right-1 top-1 h-10 w-10 rounded-full bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4 text-primary-foreground" />
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            O robô é pausado automaticamente se você assumir.
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
