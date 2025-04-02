# Guia Detalhado de Deploy no Vercel

Este documento fornece instruções passo a passo para implantar o Portfolio Fullstack no Vercel, incluindo configuração do banco de dados, variáveis de ambiente e resolução de problemas comuns.

## Pré-requisitos

1. Uma conta no [Vercel](https://vercel.com)
2. Uma conta no [Neon Database](https://neon.tech) ou outro provedor PostgreSQL
3. Repositório Git (GitHub, GitLab, Bitbucket)

## Configuração do Banco de Dados

### Usando Neon Database

1. Acesse [Neon Dashboard](https://console.neon.tech)
2. Clique em "New Project"
3. Dê um nome ao seu projeto (ex: "portfolio-db")
4. Selecione a região mais próxima de seus usuários
5. Clique em "Create Project"
6. Na página do projeto, vá para a aba "Connection Details"
7. Copie a "Connection string" completa que será usada como `DATABASE_URL`

### Migrações de Banco de Dados

Antes do deploy, certifique-se de que suas tabelas estão criadas corretamente:

1. Configure a variável de ambiente `DATABASE_URL` localmente (arquivo `.env`)
2. Execute o comando para criar as tabelas:
   ```bash
   npx drizzle-kit push:pg
   ```

## Deploy no Vercel

### Preparação do Projeto

1. Certifique-se que você tem os arquivos necessários:
   - `vercel.json` na raiz do projeto
   - Configuração correta em `server/db.ts` para conexão com o banco de dados

### Passos do Deploy

1. Faça login no [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em "Add New" > "Project"
3. Selecione seu repositório
4. Configure o projeto:
   - Framework Preset: Other
   - Build Command: Deixe o padrão (npm run build)
   - Output Directory: dist/public
   - Install Command: npm install

5. Configure as Variáveis de Ambiente:
   - `DATABASE_URL`: Cole a string de conexão do seu banco de dados Neon
   - `SESSION_SECRET`: Uma string aleatória e complexa para proteger as sessões
   - Opcional: `NODE_ENV`: Defina como "production"

6. Clique em "Deploy"

### Verificação do Deploy

1. Após o deploy, Vercel fornecerá uma URL (ex: `seu-projeto.vercel.app`)
2. Visite a URL para verificar se o frontend está carregando corretamente
3. Teste a área de Login (`/login`) e outras funcionalidades que dependem do backend

## Configuração de Domínio Personalizado (Opcional)

1. No dashboard do Vercel, selecione seu projeto
2. Vá para "Settings" > "Domains"
3. Adicione seu domínio personalizado e siga as instruções para configurar DNS

## Resolução de Problemas Comuns

### Erro de Conexão com Banco de Dados

- Verifique se a string de conexão está correta e completa
- Certifique-se que seu IP está na lista de permissões do Neon Database
- Verifique os logs no Vercel para mensagens de erro específicas

### Erro de Construção (Build Error)

- Verifique se todos os pacotes necessários estão listados em `package.json`
- Verifique os logs de build no Vercel para identificar problemas específicos

### Erro 404 em Rotas do Frontend

- Verifique se `vercel.json` está configurado corretamente para direcionar todas as rotas do frontend
- Certifique-se que as rotas no arquivo `client/src/App.tsx` estão corretamente definidas

### Problemas com API

- Teste as rotas da API usando `/api/projects` e outras rotas disponíveis
- Verifique se as requisições estão sendo direcionadas corretamente para o backend

## Manutenção e Atualizações

### Como Realizar Atualizações

1. Faça alterações no código localmente
2. Teste localmente usando `npm run dev`
3. Faça commit e push para seu repositório
4. Vercel automaticamente detectará as alterações e fará um novo deploy

### Monitoramento

- Use o painel do Vercel para monitorar:
  - Status do deploy
  - Logs do servidor
  - Métricas de desempenho
  - Erros e falhas

## Recursos Adicionais

- [Documentação do Vercel](https://vercel.com/docs)
- [Documentação do Neon Database](https://neon.tech/docs)
- [Documentação do Drizzle ORM](https://orm.drizzle.team/docs/overview)