import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Scissors, CheckCircle, Smartphone, Calendar, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 lg:px-14 h-16 flex items-center border-b border-white/10 bg-background/50 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="flex items-center justify-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Scissors className="w-4 h-4" />
          </div>
          Meu Barbeiro App
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/login">
            <Button variant="secondary" size="sm" className="font-bold border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20">
              Área do Barbeiro (Login)
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button size="sm">Começar Grátis</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-48 flex items-center justify-center px-4 md:px-6 bg-gradient-to-b from-background to-secondary/20">
          <div className="flex flex-col items-center space-y-8 text-center max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-primary/20 bg-primary/10 text-primary">
                O melhor sistema para barbearias
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                Gestão completa para sua <span className="text-primary">Barbearia</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Automatize agendamentos, controle seu financeiro e fidelize clientes com o sistema mais moderno do mercado. Tudo em um só lugar.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/cadastro">
                <Button size="lg" className="h-12 px-8 text-base">Criar minha Conta</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">Área do Barbeiro</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 md:py-32 flex items-center justify-center px-4 md:px-6">
          <div className="max-w-5xl mx-auto grid gap-12 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Agenda Inteligente</h3>
              <p className="text-muted-foreground">Seus clientes agendam online 24h por dia e você não perde mais tempo pelo WhatsApp.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Gestão Financeira</h3>
              <p className="text-muted-foreground">Controle de caixa, relatórios de faturamento diário e mensal com gráficos detalhados.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">100% Mobile</h3>
              <p className="text-muted-foreground">Aplicativo responsivo, perfeito para o barbeiro e para o cliente acessarem do celular de onde estiverem.</p>
            </div>
          </div>
        </section>

        {/* Social Proof / Check */}
        <section className="w-full py-20 bg-primary/5 flex items-center justify-center px-4 border-y border-primary/10">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <div className="space-y-4 max-w-md">
              <h2 className="text-3xl font-bold">Tudo que seu negócio precisa</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /> Multi-profissionais</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /> Controle de Estoque (Produtos)</li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /> Lembretes por WhatsApp Automático</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 flex items-center justify-center border-t border-white/5">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Meu Barbeiro App. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
