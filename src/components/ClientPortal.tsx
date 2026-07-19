'use client';

import { useState, useEffect } from 'react';
import { ChatBot } from './ChatBot';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, CalendarClock, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: string;
  stock: number;
}

export function ClientPortal({ barbershopId, barbershopName }: { barbershopId: string, barbershopName: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setProducts(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent drop-shadow-sm mb-2">{barbershopName}</h1>
        <p className="text-muted-foreground">Portal do Cliente</p>
      </div>

      <Tabs defaultValue="agendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="agendar" className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4" />
            Agendamento
          </TabsTrigger>
          <TabsTrigger value="produtos" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Produtos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agendar" className="mt-0">
          <ChatBot barbershopId={barbershopId} />
        </TabsContent>

        <TabsContent value="produtos" className="mt-0">
          <Card className="glass-card border-white/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-primary">
                <PackageOpen className="w-5 h-5" /> Vitrine de Produtos
              </CardTitle>
              <CardDescription>
                Conheça nossos produtos disponíveis para compra presencial na barbearia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="w-8 h-8 rounded-full border-b-2 border-primary animate-spin"></div>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map(product => (
                    <div key={product.id} className="border border-white/10 rounded-xl p-4 bg-background/40 hover:bg-card/80 transition-all flex flex-col justify-between group">
                      <div className="flex gap-4 mb-4">
                        {/* Image */}
                        <div className="w-20 h-20 shrink-0 rounded-lg bg-secondary/50 flex flex-col items-center justify-center border border-white/5 overflow-hidden relative">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <>
                              <PackageOpen className="w-6 h-6 text-muted-foreground/50 mb-1 group-hover:scale-110 transition-transform" />
                              <span className="text-[10px] text-muted-foreground/40 font-medium">FOTO</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-extrabold text-lg leading-tight text-foreground">{product.name}</h4>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary mt-1 mb-2">
                            R$ {Number(product.price).toFixed(2)}
                          </Badge>
                          {product.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                        <span className="text-xs text-muted-foreground font-medium">
                          Estoque: {product.stock > 0 ? <span className="text-primary">{product.stock} un</span> : 'Esgotado'}
                        </span>
                        <Button variant="outline" size="sm" className="h-8 text-xs btn-premium" disabled={product.stock <= 0}>
                          Reservar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-background/30 rounded-xl border border-dashed border-white/10">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4 opacity-30" />
                  <p className="text-muted-foreground">Nenhum produto cadastrado no momento.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
