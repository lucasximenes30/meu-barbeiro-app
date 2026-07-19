'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.role === 'SUPER_ADMIN') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        setError(data.message || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex-1 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 glass-card rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden -mt-12 md:-mt-6">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-bold text-primary mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Meu Barbeiro App</h1>
          <p className="text-muted-foreground">Faça login para acessar o painel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail Profissional</Label>
            <Input
              id="email"
              type="email"
              placeholder="contato@barbearia.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50 border-white/10 focus-visible:ring-primary/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/50 border-white/10 focus-visible:ring-primary/50"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full btn-premium py-6 text-base shadow-lg shadow-primary/20" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar no Sistema'}
          </Button>
        </form>
      </div>
    </div>
  );
}
