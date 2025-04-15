import * as dotenv from 'dotenv';
dotenv.config();

import { neon } from '@neondatabase/serverless';

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Create Neon connection
const client = neon(process.env.DATABASE_URL);

async function checkSessionTable() {
  try {
    console.log('Verificando tabela de sessões...');
    
    // Verificar se a tabela existe
    const tableCheck = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'session'
      );
    `;
    
    const tableExists = tableCheck[0].exists;
    console.log(`Tabela de sessões existe: ${tableExists}`);
    
    if (!tableExists) {
      console.log('Criando tabela de sessões...');
      await client`
        CREATE TABLE "session" (
          "sid" varchar NOT NULL COLLATE "default",
          "sess" json NOT NULL,
          "expire" timestamp(6) NOT NULL,
          CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
        );
      `;
      console.log('Tabela de sessões criada com sucesso!');
    } else {
      // Verificar estrutura da tabela
      const tableStructure = await client`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'session';
      `;
      
      console.log('Estrutura da tabela de sessões:');
      tableStructure.forEach(column => {
        console.log(`- ${column.column_name}: ${column.data_type}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao verificar tabela de sessões:', error);
    process.exit(1);
  }
}

checkSessionTable(); 