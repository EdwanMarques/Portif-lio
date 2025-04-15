import * as dotenv from 'dotenv';
dotenv.config();

import { neon } from '@neondatabase/serverless';
import { users } from '@shared/schema';

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Create Neon connection
const client = neon(process.env.DATABASE_URL);

async function fixUsersTable() {
  try {
    console.log('Iniciando correção da tabela de usuários...');
    
    // Drop the existing users table
    console.log('Removendo a tabela de usuários existente...');
    await client`DROP TABLE IF EXISTS users CASCADE`;
    
    // Create the users table with the correct structure
    console.log('Criando a tabela de usuários com a estrutura correta...');
    await client`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;
    
    console.log('Tabela de usuários corrigida com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao corrigir a tabela de usuários:', error);
    process.exit(1);
  }
}

fixUsersTable();