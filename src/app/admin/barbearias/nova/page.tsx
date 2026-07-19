'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, User, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewBarbershopPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Erro ao criar barbearia");
      }

      router.push('/admin/barbearias');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link href="/admin/barbearias">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Nova Barbearia</h1>
          <p className="text-muted-foreground mt-1">Crie uma nova franquia e o usuário dono (Barber).</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                Dados da Barbearia
              </CardTitle>
              <CardDescription className="text-zinc-500">Informações públicas do negócio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="barbershopName" className="text-zinc-300">Nome da Barbearia</Label>
                <Input 
                  id="barbershopName" 
                  name="barbershopName" 
                  required 
                  className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-primary" 
                  placeholder="Ex: Barbearia do Zé" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-zinc-300">Telefone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-primary" 
                  placeholder="(00) 00000-0000" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscriptionFee" className="text-zinc-300">Mensalidade (R$)</Label>
                <Input 
                  id="subscriptionFee" 
                  name="subscriptionFee" 
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue="99.90"
                  required
                  className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-primary" 
                  placeholder="Ex: 99.90" 
                />
              </div>
              {/* Optional: Add Document, Address, City later */}
            </CardContent>
          </Card>

          <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Dados do Administrador
              </CardTitle>
              <CardDescription className="text-zinc-500">Conta master da loja (Role: BARBER)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName" className="text-zinc-300">Nome do Dono</Label>
                <Input 
                  id="ownerName" 
                  name="ownerName" 
                  required 
                  className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-primary" 
                  placeholder="Ex: José da Silva" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">E-mail Profissional</Label>
                <Input 
                  id="email" 
                  type="email"
                  name="email" 
                  required 
                  className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-primary" 
                  placeholder="contato@barbearia.com" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Senha Provisória</Label>
                <Input 
                  id="password" 
                  type="password"
                  name="password" 
                  required 
                  className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-primary" 
                  placeholder="********" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Link href="/admin/barbearias">
            <Button type="button" variant="ghost" className="text-zinc-400 hover:text-white">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[150px]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Plataforma"}
          </Button>
        </div>
      </form>
    </div>
  );
}
