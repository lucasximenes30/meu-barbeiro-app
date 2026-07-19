# Meu Barbeiro App - Resumo do Sistema

Este documento fornece um panorama geral do estado atual do sistema "Meu Barbeiro App", detalhando tudo o que já foi implementado, a arquitetura e as tecnologias em uso.

## 1. Visão Geral
O Meu Barbeiro App é uma aplicação web completa para gestão e agendamento de barbearias. O sistema foi projetado para administrar desde o cadastro do cliente e sua marcação de horário até o fluxo financeiro, vendas de produtos e configurações específicas de cada barbeiro.

## 2. Stack Tecnológica
A aplicação utiliza uma stack moderna baseada em TypeScript e no ecossistema do React:
- **Framework Front-end / Back-end**: Next.js (App Router).
- **Linguagem**: TypeScript.
- **Banco de Dados & ORM**: PostgreSQL hospedado no Neon, operado através do Prisma ORM (`@prisma/client`, `@prisma/adapter-neon`).
- **Gerenciamento de Estado**: Zustand (React hooks globais).
- **Gerenciamento de Requisições**: React Query (`@tanstack/react-query`).
- **Estilização e Componentes**: Tailwind CSS v4, componentes Shadcn UI (com Radix UI / Base UI), Lucide React (ícones), class-variance-authority, clsx e tailwind-merge.
- **Formulários e Validação**: React Hook Form integrado com Zod para tipagem rigorosa.
- **Gráficos**: Recharts para visualização de dados financeiros e do dashboard.
- **Envio de E-mails**: Nodemailer.

## 3. Arquitetura do Projeto
O projeto está organizado de forma modular para facilitar a manutenção e escalabilidade.

### Estrutura de Pastas:
- **`src/app/`**: Contém as rotas principais da aplicação e páginas da interface (Front-end), bem como as rotas de API no diretório `src/app/api`.
- **`src/app/api/`**: Endpoints RESTful para operações de backend (Auth, Appointments, Barbershops, Clients, Finance, Products, Services, Settings, Users, Cron, Health).
- **`src/modules/`**: Encapsula as regras de negócios, serviços (`.service.ts`) e comunicação direta com o banco/camada de persistência (`.repository.ts`).
- **`src/store/`**: Contém os hooks do Zustand para compartilhamento de estado global no navegador (`useAppointmentsStore`, `useClientsStore`, `useFinancialStore`, `useProductsStore`, `useServicesStore`, `useSettingsStore`).
- **`prisma/`**: Contém o esquema do banco de dados (`schema.prisma`) que mapeia todos os modelos de dados.

## 4. Módulos e Funcionalidades Implementadas

O banco de dados e os serviços de back-end / front-end já cobrem os seguintes módulos:

### 4.1. Barbearia e Usuários
- Suporte a múltiplas barbearias/filiais.
- Gerenciamento de equipe com níveis de acesso definidos (`OWNER`, `ADMIN`, `BARBER`, `RECEPTIONIST`).

### 4.2. Clientes
- Cadastro completo de clientes com nome, e-mail, telefone e anotações.
- Rota no painel de administração (`/clientes`) e integração na API (`/api/clients`).

### 4.3. Serviços
- Cadastro dos serviços oferecidos na barbearia, onde pode ser definida a duração em minutos e o preço.
- Rota no painel (`/servicos`) e API.

### 4.4. Produtos e Vendas
- Controle de estoque e catálogo de produtos (`Product`).
- Histórico de vendas físicas (`ProductSale`), permitindo a baixa no estoque.
- Rota no painel (`/produtos`) e integração na API.

### 4.5. Agendamentos
- Fluxo de agendamentos (`Appointment`) vinculando cliente, barbeiro (usuário) e o serviço desejado.
- Máquina de status abrangente para o agendamento: `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELED`, `NO_SHOW`.
- O cliente pode possivelmente fazer o auto-agendamento pela rota (`/agendamento`) enquanto o barbeiro controla sua rota administrativa (`/agendar` e `/dashboard`).

### 4.6. Financeiro
- Fluxo de caixa com entrada (`INCOME`) e saída (`EXPENSE`) pelo modelo `FinancialTransaction`.
- Transações podem ser opcionalmente atreladas a uma venda de produto ou a um agendamento finalizado.
- Rota visual de controle (`/financeiro`) e rotas da API isoladas.

### 4.7. Configurações, Escalas e Bloqueios
- Controle global do estabelecimento: horários de abertura, fechamento e duração padrão do slot de horário (ex: 30 minutos).
- **Escalas de trabalho (`WorkSchedule`)**: Determinação do horário padrão que cada barbeiro atende na semana, incluindo horário de pausa.
- **Horários Bloqueados (`BlockedTime`)**: Gerenciamento de exceções (férias, atestados ou dias fechados da barbearia).

## 5. Conclusão
O sistema "Meu Barbeiro App" se encontra com sua fundação de back-end e banco de dados muito bem solidificada. A interface front-end está construída usando os princípios e componentes modernos (Next 14+, Tailwind, Shadcn), e todos os Stores de estado globais foram divididos estrategicamente por domínio, garantindo escalabilidade para os próximos desenvolvimentos.
