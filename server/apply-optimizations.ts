import * as dotenv from 'dotenv';
dotenv.config();

import { neon } from '@neondatabase/serverless';

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Create Neon connection
const client = neon(process.env.DATABASE_URL);

async function applyOptimizations() {
  try {
    console.log('Aplicando otimizações no banco de dados...');
    
    // 1. Executar VACUUM na tabela de sessões
    console.log('1. Executando VACUUM na tabela de sessões...');
    await client`VACUUM session`;
    console.log('   VACUUM concluído com sucesso!');
    
    // 2. Executar VACUUM na tabela de projetos
    console.log('2. Executando VACUUM na tabela de projetos...');
    await client`VACUUM projects`;
    console.log('   VACUUM concluído com sucesso!');
    
    // 3. Adicionar índice para email na tabela de contatos
    console.log('3. Verificando se o índice para email já existe na tabela de contatos...');
    const indexExists = await client`
      SELECT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'contacts'
        AND indexname = 'contacts_email_idx'
      );
    `;
    
    if (!indexExists[0].exists) {
      console.log('   Criando índice para email na tabela de contatos...');
      await client`CREATE INDEX contacts_email_idx ON contacts (email)`;
      console.log('   Índice criado com sucesso!');
    } else {
      console.log('   O índice já existe.');
    }
    
    // 4. Remover tabelas extras que não fazem parte do projeto
    console.log('4. Verificando tabelas extras...');
    const extraTables = ['menu_items', 'orders', 'order_items', 'categories'];
    
    for (const table of extraTables) {
      const tableExists = await client`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${table}'
        );
      `;
      
      if (tableExists[0].exists) {
        console.log(`   Removendo tabela ${table}...`);
        await client`DROP TABLE IF EXISTS "${table}" CASCADE`;
        console.log(`   Tabela ${table} removida com sucesso!`);
      } else {
        console.log(`   Tabela ${table} não existe.`);
      }
    }
    
    console.log('\nOtimizações aplicadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao aplicar otimizações:', error);
    process.exit(1);
  }
}

applyOptimizations(); 