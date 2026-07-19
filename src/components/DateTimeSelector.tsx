import { useState } from 'react';
import { addDays, format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateTimeSelectorProps {
  onSelect: (date: string, time: string) => void;
}

export function DateTimeSelector({ onSelect }: DateTimeSelectorProps) {
  const next14Days = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i));
  const [selectedDate, setSelectedDate] = useState<Date | null>(next14Days[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'];

  return (
    <div className="w-full mt-2 -mx-4 px-4 pb-2">
      <div className="text-[10px] text-zinc-500 font-bold mb-3 uppercase tracking-wider">Selecione o dia e horário:</div>
      
      {/* Dates Horizontal Scroll */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-2 pb-4">
        {next14Days.map((date, idx) => {
          const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
          const diaSemana = format(date, 'EEE', { locale: ptBR }).substring(0, 3).toUpperCase();
          const diaMes = isToday(date) ? 'HOJE' : format(date, 'dd');
          const mes = format(date, 'MMM', { locale: ptBR }).substring(0, 3).toUpperCase();
          
          return (
            <div 
              key={idx}
              onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
              className={`shrink-0 snap-start flex flex-col items-center justify-center p-3 rounded-2xl min-w-[75px] cursor-pointer transition-all border ${
                isSelected 
                  ? 'bg-primary border-primary shadow-[0_0_15px_var(--color-primary)]/40 text-primary-foreground ring-2 ring-primary/50' 
                  : 'bg-zinc-900 border-white/5 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <span className={`text-[10px] font-bold mb-1 opacity-80 ${isSelected ? 'text-primary-foreground' : 'text-zinc-500'}`}>{diaSemana}</span>
              <span className={`text-xl font-bold tracking-tight mb-1 ${isSelected ? 'text-white' : 'text-white'}`}>{diaMes}</span>
              <span className={`text-[10px] font-bold opacity-80 ${isSelected ? 'text-primary-foreground' : 'text-zinc-500'}`}>{mes}</span>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center gap-2 text-zinc-600 mb-6 px-1">
         <span className="flex-1 h-[1px] bg-zinc-800 block"></span>
         <span className="text-[8px] font-bold tracking-widest uppercase">Arraste para o lado para ver mais</span>
      </div>

      {/* Times Grid */}
      <div className="grid grid-cols-3 gap-2 mb-6 max-h-48 overflow-y-auto scrollbar-hide px-1">
        {times.map((time, idx) => {
          const isSelected = selectedTime === time;
          return (
            <button
              key={idx}
              onClick={() => setSelectedTime(time)}
              className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                isSelected 
                  ? 'bg-primary border-primary shadow-[0_0_10px_var(--color-primary)]/40 text-primary-foreground' 
                  : 'bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {time}
            </button>
          )
        })}
      </div>
      
      {/* Footer text */}
      <div className="flex flex-col items-center gap-4">
        <div className="bg-zinc-900/50 border border-white/5 py-3 w-full text-center rounded-2xl text-xs font-bold text-zinc-400 tracking-wide">
          {selectedDate ? (
            `${format(selectedDate, "eee, dd 'de' MMMM 'de' yyyy", { locale: ptBR }).toLowerCase()} -- ${selectedTime || ''}`
          ) : '--'}
        </div>

        <button 
          onClick={() => {
            if (selectedDate && selectedTime) {
              const formattedDate = format(selectedDate, "EEE - dd/MM/yyyy", { locale: ptBR }).replace(/^\w/, c => c.toUpperCase());
              onSelect(formattedDate, selectedTime);
            }
          }}
          disabled={!selectedDate || !selectedTime}
          className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all shadow-xl ${
            selectedDate && selectedTime
              ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-white/10' 
              : 'bg-zinc-900/50 text-zinc-600 border border-transparent cursor-not-allowed'
          }`}
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}
