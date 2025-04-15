import * as dotenv from 'dotenv';
dotenv.config();

import { neon } from '@neondatabase/serverless';

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Create Neon connection
const client = neon(process.env.DATABASE_URL);

async function checkIndexes() {
  try {
    console.log('Verificando índices do banco de dados...');
    
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
    
    // Verificar índices de cada tabela
    for (const table of tables) {
      console.log(`\nÍndices da tabela ${table.table_name}:`);
      const indexes = await client`
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
          AND t.relname = ${table.table_name};
      `;
      
      if (indexes.length === 0) {
        console.log('  - Nenhum índice encontrado');
      } else {
        indexes.forEach(index => {
          console.log(`  - ${index.index_name}: ${index.column_name} (${index.is_unique ? 'único' : 'não único'}, ${index.is_primary ? 'chave primária' : 'não é chave primária'})`);
        });
      }
    }
    
    // Verificar configurações de performance
    console.log('\nConfigurações de performance:');
    const settings = await client`
      SELECT name, setting, unit, context
      FROM pg_settings
      WHERE name IN (
        'shared_buffers',
        'work_mem',
        'maintenance_work_mem',
        'effective_cache_size',
        'wal_buffers',
        'checkpoint_completion_target',
        'random_page_cost',
        'effective_io_concurrency'
      );
    `;
    
    settings.forEach(setting => {
      console.log(`- ${setting.name}: ${setting.setting}${setting.unit ? ' ' + setting.unit : ''} (${setting.context})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao verificar índices:', error);
    process.exit(1);
  }
}

checkIndexes(); 