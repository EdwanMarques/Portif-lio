# 🚀 Guia Completo de Deploy

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Preparação do Ambiente](#preparação-do-ambiente)
3. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
4. [Deploy no Vercel](#deploy-no-vercel)
5. [Configuração de Domínio](#configuração-de-domínio)
6. [Monitoramento e Manutenção](#monitoramento-e-manutenção)
7. [Solução de Problemas](#solução-de-problemas)

## 🔍 Pré-requisitos

### Contas Necessárias
- [Vercel](https://vercel.com) - Plataforma de deploy
- [Neon Database](https://neon.tech) - Banco de dados PostgreSQL
- [GitHub](https://github.com) - Controle de versão

### Requisitos Técnicos
- Node.js 18 ou superior
- Git instalado
- NPM ou Yarn
- Acesso SSH configurado (opcional, mas recomendado)

## 🛠️ Preparação do Ambiente

### 1. Configuração Local
```bash
# Clone o repositório
git clone [URL_DO_REPOSITÓRIO]

# Instale as dependências
npm install

# Crie o arquivo de ambiente
cp .env.example .env
```

### 2. Variáveis de Ambiente
Configure as seguintes variáveis no arquivo `.env`:
```env
# Banco de Dados
DATABASE_URL=postgres://user:password@host:port/database

# Segurança
SESSION_SECRET=seu_segredo_muito_seguro
NODE_ENV=development

# URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000
```

## 💾 Configuração do Banco de Dados

### 1. Criando o Banco no Neon
1. Acesse [Neon Dashboard](https://console.neon.tech)
2. Clique em "New Project"
3. Configure:
   - Nome do projeto
   - Região (escolha a mais próxima)
   - PostgreSQL version (recomendado: 15)
4. Clique em "Create Project"

### 2. Configurando o Banco
1. Na página do projeto, vá para "Connection Details"
2. Copie a "Connection string"
3. Configure as permissões de acesso:
   - Adicione seu IP atual
   - Configure usuários e permissões

### 3. Executando Migrações
```bash
# Instale o CLI do Drizzle
npm install -g drizzle-kit

# Execute as migrações
npx drizzle-kit push:pg
```

## 🚀 Deploy no Vercel

### 1. Preparação do Projeto
1. Certifique-se que os arquivos necessários existem:
   - `vercel.json`
   - `package.json`
   - `.env.production`

2. Verifique o `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "client/dist/$1"
    }
  ]
}
```

### 2. Processo de Deploy
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em "Add New" > "Project"
3. Importe seu repositório
4. Configure o projeto:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3. Variáveis de Ambiente no Vercel
Configure as seguintes variáveis:
```env
DATABASE_URL=sua_connection_string
SESSION_SECRET=seu_segredo
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.vercel.app
API_URL=https://seu-dominio.vercel.app/api
```

## 🌐 Configuração de Domínio

### 1. Domínio Personalizado
1. No dashboard do Vercel, vá para "Settings" > "Domains"
2. Adicione seu domínio
3. Configure os registros DNS:
   - A Record: apontando para 76.76.21.21
   - CNAME Record: www apontando para cname.vercel-dns.com

### 2. SSL/HTTPS
1. O Vercel configura SSL automaticamente
2. Verifique o certificado em "Settings" > "Domains"
3. Aguarde a propagação DNS (pode levar até 48h)

## 📊 Monitoramento e Manutenção

### 1. Logs e Métricas
- Acesse "Deployments" no Vercel
- Clique em um deployment
- Vá para a aba "Runtime Logs"

### 2. Performance
- Use o Analytics do Vercel
- Monitore:
  - Tempo de resposta
  - Taxa de erro
  - Uso de recursos

### 3. Backup
1. Configure backup automático no Neon Database
2. Exporte dados regularmente:
```bash
pg_dump -U user -d database > backup.sql
```

## 🔧 Solução de Problemas

### Problemas Comuns

#### 1. Erro de Build
```bash
# Verifique os logs
vercel logs

# Limpe o cache
vercel deploy --force
```

#### 2. Erro de Conexão com Banco
- Verifique a string de conexão
- Confirme as permissões do IP
- Teste a conexão localmente

#### 3. Erro 404 em Rotas
- Verifique o `vercel.json`
- Confirme as rotas no frontend
- Verifique o build output

### Contato e Suporte
- [Documentação do Vercel](https://vercel.com/docs)
- [Suporte do Neon](https://neon.tech/docs)
- [Issues do GitHub](https://github.com/seu-usuario/seu-repositorio/issues)

## 📚 Recursos Adicionais

- [Documentação do Vercel](https://vercel.com/docs)
- [Documentação do Neon](https://neon.tech/docs)
- [Guia de Performance](https://vercel.com/docs/performance)
- [Best Practices](https://vercel.com/docs/best-practices)