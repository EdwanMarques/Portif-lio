import * as dotenv from 'dotenv';
dotenv.config();

import { Pool } from '@neondatabase/serverless';

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Create Neon connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function removeExtraTables() {
  try {
    console.log('Removendo tabelas extras...');
    
    // Lista de tabelas para remover
    const tables = ['menu_items', 'orders', 'order_items', 'categories'];
    
    // Remover cada tabela individualmente
    for (const table of tables) {
      console.log(`Removendo tabela ${table}...`);
      await pool.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
      console.log(`Tabela ${table} removida com sucesso!`);
    }
    
    console.log('\nTodas as tabelas extras foram removidas com sucesso!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Erro ao remover tabelas extras:', error);
    await pool.end();
    process.exit(1);
  }
}

removeExtraTables(); 