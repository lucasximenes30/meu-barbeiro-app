import {
  Product,
  Appointment,
  Client,
  Service,
  Transaction,
  BarbershopSettings,
} from '../types';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    nome: 'Pomada Modeladora Efeito Matte',
    descricao: 'Pomada modeladora de alta fixação para todos os tipos de cabelo.',
    preco: 45.9,
    categoria: 'Cabelo',
    estoque: 15,
  },
  {
    id: 'p2',
    nome: 'Óleo para Barba Lenhador',
    descricao: 'Óleo hidratante com fragrância amadeirada.',
    preco: 35.0,
    categoria: 'Barba',
    estoque: 3,
  },
  {
    id: 'p3',
    nome: 'Shampoo Refrescante Ice',
    descricao: 'Shampoo com extrato de menta para limpeza profunda.',
    preco: 28.5,
    categoria: 'Cabelo',
    estoque: 0,
  },
];

export const mockClients: Client[] = [
  {
    id: 'c1',
    nome: 'João Silva',
    telefone: '(11) 98765-4321',
    ultimaVisita: '2026-07-10T14:30:00Z',
    historico: [],
  },
  {
    id: 'c2',
    nome: 'Carlos Eduardo',
    telefone: '(11) 91234-5678',
    ultimaVisita: '2026-07-05T09:00:00Z',
    historico: [],
  },
  {
    id: 'c3',
    nome: 'Lucas Mendes',
    telefone: '(11) 99988-7766',
    ultimaVisita: '2026-06-20T16:00:00Z',
    historico: [],
  },
];

export const mockServices: Service[] = [
  {
    id: 's1',
    nome: 'Corte Clássico',
    duracaoMinutos: 40,
    preco: 40.0,
  },
  {
    id: 's2',
    nome: 'Barba Completa',
    duracaoMinutos: 30,
    preco: 30.0,
  },
  {
    id: 's3',
    nome: 'Corte + Barba',
    duracaoMinutos: 60,
    preco: 60.0,
  },
  {
    id: 's4',
    nome: 'Sobrancelha',
    duracaoMinutos: 10,
    preco: 15.0,
  },
];

// Gerar agendamentos dinâmicos ao redor da data atual para o mock fazer sentido
const hoje = new Date();
const ontem = new Date(hoje);
ontem.setDate(ontem.getDate() - 1);
const amanha = new Date(hoje);
amanha.setDate(amanha.getDate() + 1);

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    clienteId: 'c1',
    servicoId: 's3',
    data: hoje.toISOString().split('T')[0],
    hora: '10:00',
    status: 'concluido',
  },
  {
    id: 'a2',
    clienteId: 'c2',
    servicoId: 's1',
    data: hoje.toISOString().split('T')[0],
    hora: '14:30',
    status: 'confirmado',
  },
  {
    id: 'a3',
    clienteId: 'c3',
    servicoId: 's2',
    data: amanha.toISOString().split('T')[0],
    hora: '09:00',
    status: 'confirmado',
  },
  {
    id: 'a4',
    clienteId: 'c1',
    servicoId: 's1',
    data: ontem.toISOString().split('T')[0],
    hora: '11:00',
    status: 'concluido',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    tipo: 'servico',
    referenciaId: 'a1',
    valor: 60.0,
    data: hoje.toISOString(),
  },
  {
    id: 't2',
    tipo: 'servico',
    referenciaId: 'a4',
    valor: 40.0,
    data: ontem.toISOString(),
  },
  {
    id: 't3',
    tipo: 'produto',
    referenciaId: 'p1',
    valor: 45.9,
    data: ontem.toISOString(),
  },
];

export const mockSettings: BarbershopSettings = {
  nome: 'Barbearia Vintage',
  endereco: 'Rua das Tesouras, 123, Centro',
  telefone: '(11) 3333-4444',
  horarioFuncionamento: [
    { diaSemana: 1, abertura: '09:00', fechamento: '19:00' }, // Segunda
    { diaSemana: 2, abertura: '09:00', fechamento: '19:00' }, // Terça
    { diaSemana: 3, abertura: '09:00', fechamento: '19:00' }, // Quarta
    { diaSemana: 4, abertura: '09:00', fechamento: '19:00' }, // Quinta
    { diaSemana: 5, abertura: '09:00', fechamento: '20:00' }, // Sexta
    { diaSemana: 6, abertura: '09:00', fechamento: '17:00' }, // Sábado
  ],
};
