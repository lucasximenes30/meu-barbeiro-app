'use client';

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

export default function BarbershopConfigPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [shop, setShop] = useState<any>(null);
  
  useEffect(() => {
    fetch(`/api/barbershops/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setShop(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Erro ao carregar dados.");
        setLoading(false);
      });
  }, [params.id]);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      subscriptionFee: formData.get("subscriptionFee"),
      isActive: formData.get("isActive") === "on",
    };

    try {
      const res = await fetch(`/api/barbershops/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erro ao salvar alterações");
      
      router.push('/admin/barbearias');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("TEM CERTEZA? Esta ação apagará a barbearia, os usuários, clientes e todo o histórico financeiro!")) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/barbershops/${params.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Erro ao apagar");
      
      router.push('/admin/barbearias');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!shop) return <div className="p-10 text-center text-zinc-400">Barbearia não encontrada.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link href="/admin/barbearias">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Configurações: {shop.name}</h1>
          <p className="text-muted-foreground mt-1">Gerencie os dados e a assinatura desta franquia.</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <Card className="bg-zinc-950/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Dados Principais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-300">Nome da Barbearia</Label>
                <Input 
                  id="name" name="name" defaultValue={shop.name} required 
                  className="bg-zinc-900 border-white/10 text-white" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-zinc-300">Telefone</Label>
                <Input 
                  id="phone" name="phone" defaultValue={shop.phone || ""} 
                  className="bg-zinc-900 border-white/10 text-white" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscriptionFee" className="text-zinc-300">Mensalidade (R$)</Label>
                <Input 
                  id="subscriptionFee" name="subscriptionFee" type="number" step="0.01" min="0" 
                  defaultValue={shop.subscriptionFee} required 
                  className="bg-zinc-900 border-white/10 text-white" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 mt-4 rounded-lg bg-white/5 border border-white/10">
              <div>
                <p className="font-medium text-white">Barbearia Ativa</p>
                <p className="text-sm text-zinc-500">Se desativada, a loja não poderá acessar o painel.</p>
              </div>
              <Switch name="isActive" defaultChecked={shop.isActive} />
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex justify-between">
          <Button type="button" onClick={handleDelete} disabled={deleting} variant="destructive" className="bg-red-500/20 text-red-500 hover:bg-red-500/40 border border-red-500/30">
            {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
            Apagar Permanentemente
          </Button>

          <div className="flex gap-4">
            <Link href="/admin/barbearias">
              <Button type="button" variant="ghost" className="text-zinc-400">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
