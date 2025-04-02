# Guia de Manutenção e Administração do Portfólio

Este documento fornece instruções detalhadas sobre como manter, atualizar e administrar seu site de portfólio após o deploy.

## Acessando a Área Administrativa

1. Navegue até `/login` na URL do seu site
2. Entre com suas credenciais de administrador:
   - Nome de usuário: aquele configurado durante a instalação inicial
   - Senha: sua senha segura definida durante a instalação

## Gerenciamento de Projetos

### Adicionar Novo Projeto

1. Faça login na área administrativa
2. Clique em "Adicionar Novo Projeto"
3. Preencha os campos obrigatórios:
   - Título: nome do projeto
   - Slug: identificador único na URL (gerado automaticamente, mas pode ser personalizado)
   - Descrição Curta: resumo breve do projeto
   - Categoria: tipo de projeto
   - Imagem Principal: URL da imagem de capa
   - Tecnologias: adicione cada tecnologia utilizada no projeto

4. Campos opcionais recomendados:
   - Descrição Detalhada: explicação completa do projeto
   - URL do Demo: link para versão demonstrativa
   - URL do Repositório: link para código-fonte
   - Screenshots: imagens adicionais do projeto
   - Funcionalidades: lista de recursos principais

5. Clique em "Salvar Projeto"

### Editar Projeto Existente

1. Na área administrativa, localize o projeto na lista
2. Clique no ícone de edição
3. Faça as alterações necessárias
4. Clique em "Salvar Projeto"

### Excluir Projeto

1. Na área administrativa, localize o projeto na lista
2. Clique no ícone de exclusão
3. Confirme a ação quando solicitado

## Gerenciamento de Contatos

### Visualização de Mensagens

- Todas as mensagens enviadas através do formulário de contato são listadas na área administrativa
- As mensagens são ordenadas das mais recentes para as mais antigas
- Você pode visualizar detalhes completos de cada mensagem clicando nela

## Manutenção do Site

### Personalização Visual

Para alterar cores, fontes ou outros elementos visuais do site:

1. Modifique o arquivo `theme.json` na raiz do projeto
2. As alterações principais de cor são controladas pela propriedade `primary` no tema
3. Para alterações mais específicas, edite os arquivos de componentes em `client/src/components/`

### Otimização de Imagens

Para melhor desempenho:

1. Comprima imagens antes de fazer upload
2. Use formatos modernos como WebP quando possível
3. Dimensione imagens apropriadamente antes de usar

### Manutenção do Banco de Dados

Em caso de necessidade de alterações no esquema do banco de dados:

1. Modifique os modelos em `shared/schema.ts`
2. Execute `npx drizzle-kit push:pg` para aplicar as alterações
3. Atenção: tenha cuidado ao modificar tabelas existentes para não perder dados

## Backup e Segurança

### Backup do Banco de Dados

Para fazer backup dos dados:

1. Use as ferramentas do Neon Database para criar snapshots
2. Ou exporte dados via SQL:
   ```bash
   pg_dump -d [sua_url_do_banco] > backup.sql
   ```

### Segurança

Recomendações para manter seu site seguro:

1. Mantenha sua senha de administrador segura e troque-a periodicamente
2. Verifique regularmente por atualizações de pacotes e aplicá-las
3. Considere ativar autenticação de dois fatores no Vercel e Neon Database
4. Não compartilhe suas variáveis de ambiente ou credenciais

## Solução de Problemas Comuns

### Problemas de Login

- Se não conseguir fazer login, verifique se está usando o usuário e senha corretos
- Em caso de esquecimento de senha, será necessário redefinir no banco de dados

### Projetos Não Aparecem

- Verifique se a categoria está configurada corretamente
- Certifique-se de que todos os campos obrigatórios estão preenchidos
- Verifique se o slug é único

### Problemas de Formulário de Contato

Se as mensagens não estiverem sendo salvas:
- Verifique a conexão com o banco de dados
- Certifique-se que a tabela `contacts` existe e está estruturada corretamente

## Atualizações e Melhorias Futuras

### Como Implementar Novas Funcionalidades

1. Clone o repositório localmente
2. Faça as alterações necessárias no código
3. Teste localmente usando `npm run dev`
4. Após verificar que tudo funciona, faça commit e push para seu repositório
5. O Vercel fará automaticamente um novo deploy com as alterações

### Ideias para Melhorias Futuras

- Integração com Google Analytics para monitoramento de tráfego
- Sistema de blog para compartilhar conhecimentos
- Galeria de certificações e conquistas
- Integração com plataformas de mídia social
- Sistema de newsletter para atualizações

## Contato e Suporte

Se precisar de ajuda adicional ou tiver dúvidas sobre como administrar seu portfólio, entre em contato com o desenvolvedor.

---

Documento criado em Abril de 2023.
Última atualização: Abril de 2025.