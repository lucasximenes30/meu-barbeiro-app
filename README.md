# Meu Barbeiro App - SaaS

Sistema SaaS para gerenciamento de barbearias, construído com Next.js 15, React 19, e Tailwind CSS v4.

## Tecnologias
- Next.js (App Router, Server Components, Server Actions)
- TypeScript
- Prisma ORM & PostgreSQL
- Tailwind CSS v4 & shadcn/ui
- React Hook Form, Zod, Zustand, TanStack Query

## Como executar o projeto

1. Instale as dependências:
   ```bash
   pnpm install
   ```

2. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Configure a URL do seu banco de dados PostgreSQL.

3. Gere o client do Prisma:
   ```bash
   pnpm prisma generate
   ```

4. Execute o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```

A API de health check estará disponível em: `http://localhost:3000/api/health`
