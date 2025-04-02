# Portfólio Fullstack

Um portfólio profissional fullstack com foco em apresentação dinâmica de projetos, habilidades técnicas e informações pessoais, otimizado para demonstrar competências em desenvolvimento web e análise de dados.

## Stack Tecnológica

- **Frontend**: React.js com Tailwind CSS
- **Backend**: Express.js
- **Banco de Dados**: PostgreSQL (Neon Database)
- **Autenticação**: Express-session com Passport.js
- **Estilização**: Tailwind CSS e Shadcn UI
- **Animações**: Framer Motion e Particles.js
- **ORM**: Drizzle ORM
- **Validação**: Zod
- **Gerenciamento de Estado**: TanStack Query (React Query)

## Estrutura do Projeto

- `/client`: Frontend React
- `/server`: Backend Express
- `/shared`: Schemas e tipos compartilhados

## Implantação no Vercel

### Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. Conta no [Neon Database](https://neon.tech) (ou outro provedor PostgreSQL)

### Configuração do Banco de Dados

1. Crie um novo projeto no Neon Database
2. Obtenha a connection string no formato: `postgres://username:password@hostname/database`

### Passos para Deploy

1. Faça o commit e push do seu código para um repositório GitHub
2. No Vercel, selecione "Add New Project"
3. Importe seu repositório GitHub
4. Configure as seguintes variáveis de ambiente:
   - `DATABASE_URL`: Sua connection string do Neon Database
   - `SESSION_SECRET`: Uma string aleatória para segurança das sessões
5. Clique em "Deploy"

### Configuração Adicional (se necessário)

- Se precisar executar migrações de banco de dados, use o CLI do Drizzle:
  ```bash
  npx drizzle-kit push:pg
  ```

## Desenvolvimento Local

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente em um arquivo `.env`
4. Execute o servidor de desenvolvimento: `npm run dev`

## Recursos

- Sistema completo de autenticação
- Painel administrativo para gerenciar projetos
- Formulário de contato
- Seção de habilidades
- Exibição de projetos
- Interface responsiva para todos os dispositivos