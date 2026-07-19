export interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  estoque: number;
  imagemUrl?: string;
}

export interface Appointment {
  id: string;
  clienteId: string;
  servicoId: string;
  data: string; // ISO date
  hora: string;
  status: 'confirmado' | 'concluido' | 'cancelado' | 'nao_compareceu';
  observacoes?: string;
}

export interface Client {
  id: string;
  nome: string;
  telefone: string;
  ultimaVisita?: string; // ISO date
  historico: Appointment[];
}

export interface Service {
  id: string;
  nome: string;
  duracaoMinutos: number;
  preco: number;
}

export interface Transaction {
  id: string;
  tipo: 'servico' | 'produto' | 'despesa';
  referenciaId: string; // ID do agendamento ou do produto
  valor: number;
  data: string; // ISO date
}

export interface BarbershopSettings {
  nome: string;
  logoUrl?: string;
  endereco: string;
  telefone: string;
  horarioFuncionamento: { diaSemana: number; abertura: string; fechamento: string }[];
}
