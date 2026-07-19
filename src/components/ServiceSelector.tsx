import { useState } from 'react';

interface ServiceSelectorProps {
  services: { id: string; name: string; price: number; duration: number }[];
  onSelect: (serviceName: string) => void;
}

export function ServiceSelector({ services, onSelect }: ServiceSelectorProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="w-full mt-2 -mx-4 px-4 pb-2">
      <div className="text-[10px] text-zinc-500 font-bold mb-3 uppercase tracking-wider">Selecione os Serviços:</div>
      
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-4">
        {services.map((service) => (
          <div 
            key={service.id}
            onClick={() => setSelectedService(service.name)}
            className={`shrink-0 w-40 snap-start flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all border ${
              selectedService === service.name 
                ? 'border-primary shadow-[0_0_15px_var(--color-primary)]/30 ring-2 ring-primary/50' 
                : 'border-white/5 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="h-32 bg-zinc-800 w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                <span className="text-zinc-500 font-medium text-[10px] uppercase tracking-widest">{service.name}</span>
              </div>
            </div>
            <div className="bg-zinc-900/90 p-3 backdrop-blur-md">
              <h4 className="font-bold text-white text-sm uppercase truncate">{service.name}</h4>
              <div className="flex justify-between items-center mt-1">
                <span className="text-zinc-400 text-[11px] font-medium">R$ {Number(service.price).toFixed(2).replace('.', ',')}</span>
                <span className="text-zinc-500 text-[10px]">{service.duration} min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2 text-zinc-600 mb-6 px-1">
         <span className="flex-1 h-[1px] bg-zinc-800 block"></span>
         <span className="text-[8px] font-bold tracking-widest uppercase">Arraste para o lado para ver mais</span>
      </div>

      <button 
        onClick={() => selectedService && onSelect(selectedService)}
        disabled={!selectedService}
        className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all shadow-xl ${
          selectedService 
            ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-white/10' 
            : 'bg-zinc-900/50 text-zinc-600 border border-transparent cursor-not-allowed'
        }`}
      >
        Enviar
      </button>
    </div>
  );
}
