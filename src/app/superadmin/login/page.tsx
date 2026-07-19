'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SuperAdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Neste ambiente de exemplo SaaS, chamariamos uma rota de auth, mas por segurança
    // podemos ter uma senha master ou apenas simular o redirecionamento.
    // Em produção, deve verificar na tabela SuperAdmin.
    try {
      const res = await fetch('/api/superadmin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/superadmin');
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Credenciais inválidas');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6 bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500 mb-2 border border-red-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Acesso Restrito</h1>
          <p className="text-sm text-zinc-400">Faça login para acessar o painel do criador.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">E-mail Administrativo</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@meusistema.com"
              required
              className="bg-zinc-950 border-zinc-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">Senha Master</Label>
            <Input
              id="password"
              type="password"
              required
              className="bg-zinc-950 border-zinc-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" variant="destructive" className="w-full h-11 text-base font-semibold mt-4" disabled={isLoading}>
            {isLoading ? 'Autenticando...' : 'Acessar Painel'}
          </Button>
        </form>
      </div>
    </div>
  );
}
