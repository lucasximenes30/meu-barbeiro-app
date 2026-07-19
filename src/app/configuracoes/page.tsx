'use client';

import { useSettingsStore } from '@/store/useSettingsStore';
import { useEffect, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSearchParams, useRouter } from 'next/navigation';
import { Zap, MessageCircle, User, Clock, ChevronRight, Settings } from 'lucide-react';

function ConfiguracoesContent() {
  const { settings, fetchSettings, updateSettings, isLoading } = useSettingsStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'perfil');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    endereco: '',
  });

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings && formData.nome === '') {
      setFormData(prev => ({
        ...prev,
        nome: settings.nome,
        telefone: settings.telefone,
        endereco: settings.endereco,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
    alert('Configurações atualizadas com sucesso!');
  };

  const onTabChange = (value: string) => {
    setActiveTab(value);
    router.replace(`/configuracoes?tab=${value}`, { scroll: false });
  };

  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const menuItems = [
    { id: 'perfil', label: 'Informações Gerais', icon: User, desc: 'Dados da barbearia' },
    { id: 'horarios', label: 'Horários', icon: Clock, desc: 'Expediente e dias letivos' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, desc: 'Lembretes e Automação' },
    { id: 'plano', label: 'Meu Plano', icon: Zap, desc: 'Assinatura e Faturamento' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            Configurações
          </h2>
          <p className="text-zinc-400 mt-1 ml-11">Gerencie a sua barbearia de ponta a ponta.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Menu */}
        <aside className="w-full md:w-72 shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0 w-full snap-x snap-mandatory touch-pan-x">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all text-left min-w-[200px] md:min-w-0 shrink-0 snap-start ${
                    isActive 
                      ? 'bg-zinc-900 border border-zinc-800 shadow-sm' 
                      : 'hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-primary text-primary-foreground' : 'bg-zinc-900'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${isActive ? 'text-white' : ''}`}>{item.label}</p>
                    <p className="text-xs opacity-70 hidden md:block">{item.desc}</p>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-zinc-600 hidden md:block" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'perfil' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Perfil da Barbearia</CardTitle>
                  <CardDescription>
                    Essas informações são visíveis para os seus clientes no agendamento.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-zinc-300">Nome do Estabelecimento</Label>
                      <Input
                        id="nome"
                        className="bg-zinc-950 border-zinc-800 h-11"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Ex: Barbearia Viking"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefone" className="text-zinc-300">Telefone / WhatsApp</Label>
                        <Input
                          id="telefone"
                          className="bg-zinc-950 border-zinc-800 h-11"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endereco" className="text-zinc-300">Endereço Completo</Label>
                      <Input
                        id="endereco"
                        className="bg-zinc-950 border-zinc-800 h-11"
                        value={formData.endereco}
                        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                        placeholder="Rua, Número - Bairro, Cidade"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
                      {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'horarios' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Expediente</CardTitle>
                  <CardDescription>
                    Determine seus dias de trabalho para liberar na agenda.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {settings?.horarioFuncionamento.map((horario) => (
                      <div key={horario.diaSemana} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-zinc-800 bg-zinc-950 rounded-xl">
                        <div className="w-32 font-bold text-zinc-300">
                          {diasSemana[horario.diaSemana]}
                        </div>
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative w-full max-w-[120px]">
                            <Input type="time" defaultValue={horario.abertura} className="bg-zinc-900 border-zinc-700 h-10" />
                          </div>
                          <span className="text-zinc-500 font-medium text-sm">até</span>
                          <div className="relative w-full max-w-[120px]">
                            <Input type="time" defaultValue={horario.fechamento} className="bg-zinc-900 border-zinc-700 h-10" />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4">
                      <Button size="lg" onClick={async () => {
                        try {
                          await updateSettings({ horarioFuncionamento: settings?.horarioFuncionamento });
                          alert('Horários salvos com sucesso!');
                        } catch (e) {
                          alert('Erro ao salvar horários.');
                        }
                      }} disabled={isLoading}>
                        {isLoading ? 'Salvando...' : 'Confirmar Horários'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="bg-zinc-900 border-zinc-800 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <MessageCircle className="w-48 h-48" />
                </div>
                <CardHeader>
                  <CardTitle className="text-white">Automação de WhatsApp</CardTitle>
                  <CardDescription>
                    Lembre seus clientes automaticamente 2h antes do corte.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center max-w-md mx-auto relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-secondary/20 flex items-center justify-center text-muted-foreground border border-zinc-800 shadow-xl">
                      <MessageCircle className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl text-white">Pronto para conectar</h3>
                      <p className="text-zinc-400 mt-2">
                        Gere o QR Code e escaneie com o WhatsApp do seu estabelecimento (Aparelhos Conectados).
                      </p>
                    </div>
                    <Button size="lg" className="w-full font-bold h-12 gap-2 mt-4">
                      <MessageCircle className="w-5 h-5" />
                      Gerar QR Code de Conexão
                    </Button>
                    <p className="text-xs text-zinc-500 font-medium">
                      Requer internet ativa no celular principal.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'plano' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Assinatura</CardTitle>
                  <CardDescription>
                    Gerencie seu plano atual e informações de faturamento.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border-2 border-primary/30 bg-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                          <Zap className="w-3.5 h-3.5 fill-primary" /> Ativo
                        </div>
                        <h3 className="font-bold text-2xl text-white">Plano Profissional</h3>
                        <p className="text-zinc-400 mt-1">Renovação em 25 de Agosto, 2026</p>
                      </div>
                      <div className="text-left md:text-right relative z-10">
                        <div className="flex items-baseline gap-1 md:justify-end">
                          <span className="text-3xl font-extrabold text-white">R$ 49</span>
                          <span className="text-xl font-bold text-zinc-300">,90</span>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium">Cobrado por mês</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                        <h4 className="font-bold text-sm text-white mb-3">Recursos Inclusos</h4>
                        <ul className="text-sm space-y-2.5 text-zinc-400">
                          <li className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Até 3 profissionais</li>
                          <li className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Agendamentos ilimitados</li>
                          <li className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Dashboard financeiro</li>
                          <li className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Vitrine de produtos</li>
                        </ul>
                      </div>
                      <div className="flex flex-col gap-3 justify-center">
                        <Button size="lg" className="w-full font-bold h-12">
                          Mudar para Plano Elite
                        </Button>
                        <Button variant="outline" size="lg" className="w-full text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white">
                          Histórico de Faturas
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default function ConfiguracoesPage() {
  return (
    <Suspense fallback={<div className="flex h-[400px] items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" /></div>}>
      <div className="p-4 pt-8 md:p-8">
        <ConfiguracoesContent />
      </div>
    </Suspense>
  );
}
