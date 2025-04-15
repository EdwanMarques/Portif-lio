import * as dotenv from 'dotenv';
dotenv.config();
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import bcryptjs from 'bcryptjs';
import { sql } from 'drizzle-orm';

// Função para criar um usuário administrador com todos os campos necessários
async function createAdminUser() {
  try {
    console.log('Verificando se já existe um usuário admin...');
    const existingUser = await db.select().from(users).where(eq(users.username, 'admin'));
    
    if (existingUser.length > 0) {
      console.log('Usuário admin já existe!');
      return;
    }

    console.log('Gerando hash para a senha...');
    const passwordHash = await bcryptjs.hash('admin123', 10);

    console.log('Criando usuário administrador...');
    const result = await db.insert(users).values({
      username: 'admin',
      password: passwordHash
    }).returning();

    console.log('Usuário administrador criado com sucesso!');
    console.log('Detalhes do usuário:', result[0]);
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
  }
}

// Executar a função
createAdminUser(); 