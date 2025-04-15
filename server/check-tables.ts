import * as dotenv from 'dotenv';
dotenv.config();

import { neon } from '@neondatabase/serverless';

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Create Neon connection
const client = neon(process.env.DATABASE_URL);

async function checkTables() {
  try {
    console.log('Verificando tabelas do banco de dados...');
    
    // Listar todas as tabelas
    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `;
    
    console.log('Tabelas encontradas:');
    tables.forEach(table => {
      console.log(`- ${table.table_name}`);
    });
    
    // Verificar estrutura de cada tabela
    for (const table of tables) {
      console.log(`\nEstrutura da tabela ${table.table_name}:`);
      const columns = await client`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = ${table.table_name};
      `;
      
      columns.forEach(column => {
        console.log(`- ${column.column_name}: ${column.data_type} (${column.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao verificar tabelas:', error);
    process.exit(1);
  }
}

checkTables(); 