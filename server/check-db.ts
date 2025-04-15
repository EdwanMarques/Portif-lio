import * as dotenv from 'dotenv';
dotenv.config();

import { Pool } from '@neondatabase/serverless';

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Create Neon connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkDatabase() {
  try {
    console.log('Verificando estado do banco de dados...\n');
    
    // Listar todas as tabelas
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('Tabelas encontradas:');
    for (const table of tables.rows) {
      console.log(`\nTabela: ${table.table_name}`);
      
      // Obter estrutura da tabela
      const columns = await pool.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = $1
        ORDER BY ordinal_position;
      `, [table.table_name]);
      
      console.log('Colunas:');
      columns.rows.forEach(column => {
        console.log(`  - ${column.column_name}: ${column.data_type} ${column.is_nullable === 'YES' ? '(nullable)' : '(not null)'} ${column.column_default ? `default: ${column.column_default}` : ''}`);
      });
      
      // Obter índices da tabela
      const indexes = await pool.query(`
        SELECT
          i.relname AS index_name,
          a.attname AS column_name,
          ix.indisunique AS is_unique,
          ix.indisprimary AS is_primary
        FROM
          pg_class t,
          pg_class i,
          pg_index ix,
          pg_attribute a
        WHERE
          t.oid = ix.indrelid
          AND i.oid = ix.indexrelid
          AND a.attrelid = t.oid
          AND a.attnum = ANY(ix.indkey)
          AND t.relkind = 'r'
          AND t.relname = $1;
      `, [table.table_name]);
      
      if (indexes.rows.length > 0) {
        console.log('Índices:');
        indexes.rows.forEach(index => {
          console.log(`  - ${index.index_name}: ${index.column_name} (${index.is_unique ? 'único' : 'não único'}, ${index.is_primary ? 'chave primária' : 'não é chave primária'})`);
        });
      }
    }
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Erro ao verificar banco de dados:', error);
    await pool.end();
    process.exit(1);
  }
}

checkDatabase(); 