export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Configurações Globais</h1>
        <p className="text-muted-foreground mt-2">Defina regras e parâmetros do SaaS.</p>
      </div>

      <div className="p-8 rounded-xl border border-white/5 bg-zinc-950/50 backdrop-blur-xl text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <span className="text-primary text-2xl">⚙️</span>
        </div>
        <h2 className="text-lg font-bold text-white">Módulo de Configurações da Plataforma</h2>
        <p className="text-zinc-500 max-w-md mx-auto mt-2">
          Edição de temas globais, mensalidades cobradas pelo uso do SaaS, termos de uso e configurações de e-mail transacional.
        </p>
      </div>
    </div>
  );
}
