import * as dotenv from 'dotenv';
dotenv.config();

import { neon } from '@neondatabase/serverless';

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Create Neon connection
const client = neon(process.env.DATABASE_URL);

async function createContactsTable() {
  try {
    console.log('Verificando se a tabela de contatos existe...');
    
    // Verificar se a tabela existe
    const tableCheck = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'contacts'
      );
    `;
    
    const tableExists = tableCheck[0].exists;
    console.log(`Tabela de contatos existe: ${tableExists}`);
    
    if (!tableExists) {
      console.log('Criando tabela de contatos...');
      await client`
        CREATE TABLE contacts (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT now()
        );
      `;
      console.log('Tabela de contatos criada com sucesso!');
    } else {
      console.log('A tabela de contatos já existe.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar tabela de contatos:', error);
    process.exit(1);
  }
}

createContactsTable(); 