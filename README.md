# Portfólio Fullstack Profissional

## 📋 Visão Geral
Um portfólio profissional fullstack desenvolvido para demonstrar competências em desenvolvimento web e análise de dados. O projeto apresenta uma interface moderna e interativa, combinando design responsivo com funcionalidades avançadas de backend.

## 🚀 Stack Tecnológica

### Frontend
- **Framework Principal**: React.js 18.3.1
- **Linguagem**: TypeScript 5.6.3
- **Estilização**: 
  - Tailwind CSS 3.4.14
  - Shadcn UI (componentes baseados em Radix UI)
- **Gerenciamento de Estado**:
  - TanStack Query (React Query) para cache e requisições
  - Zustand 5.0.3 para estado global
- **Roteamento**: React Router DOM 7.5.0
- **Animações e Efeitos**:
  - Framer Motion
  - Particles.js
- **Validação**: Zod 3.23.8

### Backend
- **Framework**: Express.js 4.21.2
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL (Neon Database)
- **ORM**: Drizzle ORM 0.39.1
- **Autenticação**: 
  - Passport.js
  - Express-session
- **Validação**: Zod

## 📁 Estrutura do Projeto

```
/
├── client/                 # Frontend React
│   ├── src/               # Código fonte
│   │   ├── components/    # Componentes React
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── hooks/        # Custom hooks
│   │   ├── contexts/     # Contextos React
│   │   ├── services/     # Serviços e APIs
│   │   └── utils/        # Funções utilitárias
│   └── public/           # Arquivos estáticos
├── server/               # Backend Express
│   ├── controllers/     # Controladores
│   ├── models/         # Modelos
│   ├── routes/         # Rotas
│   ├── middleware/     # Middlewares
│   └── utils/          # Utilitários
├── shared/             # Código compartilhado
│   ├── types/         # Tipos TypeScript
│   └── schemas/       # Schemas Zod
└── migrations/        # Migrações do banco
```

## 🛠️ Funcionalidades Principais

### Frontend
- Interface responsiva e moderna
- Animações suaves e interativas
- Sistema de temas (claro/escuro)
- Formulários validados
- Loading states e feedback visual
- SEO otimizado

### Backend
- API RESTful
- Autenticação segura
- Upload de arquivos
- Cache e otimização
- Logging e monitoramento
- Rate limiting

### Área Administrativa
- Dashboard interativo
- CRUD de projetos
- Gerenciamento de mensagens
- Estatísticas e métricas
- Configurações do site

## 🚀 Deploy

### Pré-requisitos
1. Conta no [Vercel](https://vercel.com)
2. Conta no [Neon Database](https://neon.tech)
3. Node.js 18+ instalado
4. Git instalado

### Configuração do Banco de Dados
1. Crie um projeto no Neon Database
2. Obtenha a connection string
3. Configure as variáveis de ambiente

### Deploy no Vercel
1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Execute o deploy

## 💻 Desenvolvimento Local

### Instalação
```bash
# Clone o repositório
git clone [URL_DO_REPOSITÓRIO]

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Build para produção
- `npm run start`: Inicia o servidor em produção
- `npm run lint`: Executa o linter
- `npm run test`: Executa os testes

## 📚 Documentação Adicional

- [Guia de Deploy](DEPLOY_GUIDE.md)
- [Checklist de Deploy](DEPLOY_CHECKLIST.md)
- [Checklist de Produção](PRODUCTION_CHECKLIST.md)
- [Guia de Manutenção](MAINTENANCE_GUIDE.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

[Seu Nome] - [seu-email@exemplo.com]

Link do Projeto: [https://github.com/seu-usuario/seu-repositorio](https://github.com/seu-usuario/seu-repositorio)