'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CadastroPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    barbershopName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ocorreu um erro ao criar a conta.');
      }

      // Redirecionar para login após o cadastro
      alert('Cadastro realizado com sucesso! Faça o login para continuar.');
      router.push('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-2">
            <Scissors className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Criar Conta</h1>
          <p className="text-sm text-zinc-400">Cadastre sua barbearia e comece a gerenciar hoje mesmo.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="barbershopName" className="text-zinc-300">Nome da Barbearia</Label>
              <Input
                id="barbershopName"
                name="barbershopName"
                placeholder="Ex: Barbearia do João"
                required
                className="bg-zinc-950 border-zinc-800"
                value={formData.barbershopName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName" className="text-zinc-300">Seu Nome</Label>
              <Input
                id="ownerName"
                name="ownerName"
                placeholder="João Silva"
                required
                className="bg-zinc-950 border-zinc-800"
                value={formData.ownerName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  className="bg-zinc-950 border-zinc-800"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-zinc-300">WhatsApp</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(11) 99999-9999"
                  required
                  className="bg-zinc-950 border-zinc-800"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-zinc-950 border-zinc-800"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold mt-4" disabled={isLoading}>
              {isLoading ? 'Criando Conta...' : 'Cadastrar Barbearia'}
            </Button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-zinc-400">
            Já possui uma conta?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
