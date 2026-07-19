'use client';

import { useSettingsStore } from '@/store/useSettingsStore';
import { useEffect, useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ConfiguracoesPage() {
  const { settings, fetchSettings, updateSettings, isLoading } = useSettingsStore();
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    endereco: '',
  });

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData({
        nome: settings.nome,
        telefone: settings.telefone,
        endereco: settings.endereco,
      });
    }
  }, [settings]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
    alert('Configurações atualizadas com sucesso!');
  };

  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">Configurações</h2>
        <p className="text-muted-foreground">Gerencie as informações da sua barbearia e horários de atendimento.</p>
      </div>

      <Tabs defaultValue="perfil" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="perfil">Perfil da Barbearia</TabsTrigger>
          <TabsTrigger value="horarios">Horários de Funcionamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="perfil">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Atualize o nome, contato e endereço da sua barbearia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid gap-2 max-w-md">
                  <Label htmlFor="nome">Nome da Barbearia</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div className="grid gap-2 max-w-md">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2 max-w-md">
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="horarios">
          <Card>
            <CardHeader>
              <CardTitle>Horários de Funcionamento</CardTitle>
              <CardDescription>
                Defina os horários em que você estará disponível para agendamentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-2xl">
                {settings?.horarioFuncionamento.map((horario) => (
                  <div key={horario.diaSemana} className="flex items-center gap-4 p-3 border rounded-md">
                    <div className="w-32 font-medium">
                      {diasSemana[horario.diaSemana]}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="time" defaultValue={horario.abertura} className="w-28" />
                      <span>até</span>
                      <Input type="time" defaultValue={horario.fechamento} className="w-28" />
                    </div>
                  </div>
                ))}
                
                <Button className="mt-4" onClick={() => alert('Horários salvos (Mock)')}>
                  Salvar Horários
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
