import * as dotenv from 'dotenv';
dotenv.config();

import { neon } from '@neondatabase/serverless';

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Create Neon connection
const client = neon(process.env.DATABASE_URL);

async function optimizeTables() {
  try {
    console.log('Iniciando otimização das tabelas...');
    
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
    
    // Otimizar cada tabela
    for (const table of tables) {
      console.log(`\nOtimizando tabela ${table.table_name}...`);
      
      // Verificar se a tabela precisa de VACUUM
      const tableStats = await client`
        SELECT 
          n_live_tup AS live_tuples,
          n_dead_tup AS dead_tuples,
          last_vacuum,
          last_autovacuum
        FROM 
          pg_stat_user_tables
        WHERE 
          relname = ${table.table_name};
      `;
      
      if (tableStats.length > 0) {
        const stats = tableStats[0];
        console.log(`  - Tuplas vivas: ${stats.live_tuples}`);
        console.log(`  - Tuplas mortas: ${stats.dead_tuples}`);
        console.log(`  - Último VACUUM: ${stats.last_vacuum || 'Nunca'}`);
        console.log(`  - Último AUTO VACUUM: ${stats.last_autovacuum || 'Nunca'}`);
        
        // Se houver muitas tuplas mortas, recomendar VACUUM
        if (stats.dead_tuples > 100) {
          console.log(`  - RECOMENDAÇÃO: Executar VACUUM na tabela ${table.table_name} para remover ${stats.dead_tuples} tuplas mortas`);
        }
      }
      
      // Verificar se a tabela precisa de índices adicionais
      const tableColumns = await client`
        SELECT 
          column_name, 
          data_type
        FROM 
          information_schema.columns
        WHERE 
          table_schema = 'public' 
          AND table_name = ${table.table_name};
      `;
      
      console.log(`  - Colunas da tabela:`);
      tableColumns.forEach(column => {
        console.log(`    - ${column.column_name}: ${column.data_type}`);
      });
      
      // Verificar se há colunas que podem se beneficiar de índices
      const potentialIndexColumns = tableColumns.filter(column => {
        // Colunas que geralmente se beneficiam de índices
        const columnName = column.column_name.toLowerCase();
        return (
          columnName.includes('id') || 
          columnName.includes('email') || 
          columnName.includes('username') || 
          columnName.includes('slug') ||
          columnName.includes('created_at') ||
          columnName.includes('updated_at')
        );
      });
      
      if (potentialIndexColumns.length > 0) {
        console.log(`  - Colunas que podem se beneficiar de índices:`);
        potentialIndexColumns.forEach(column => {
          console.log(`    - ${column.column_name}`);
        });
      }
    }
    
    console.log('\nOtimização concluída!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao otimizar tabelas:', error);
    process.exit(1);
  }
}

optimizeTables(); 