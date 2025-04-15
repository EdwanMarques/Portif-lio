import * as dotenv from 'dotenv';
dotenv.config();
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Função para resetar o sistema e permitir acesso à rota /setup novamente
async function resetSetup() {
  try {
    console.log('Iniciando processo de reset do sistema...');
    console.log('Conectando ao banco de dados...');
    
    // Obter todos os usuários
    console.log('Buscando usuários no banco de dados...');
    const allUsers = await db.select().from(users);
    
    console.log(`Total de usuários encontrados: ${allUsers.length}`);
    
    if (allUsers.length === 0) {
      console.log('Nenhum usuário encontrado no banco de dados. A rota /setup já está disponível.');
      process.exit(0);
    }
    
    // Exibir informações sobre os usuários que serão removidos
    console.log('Os seguintes usuários serão removidos:');
    allUsers.forEach(user => {
      console.log(`- ${user.username} (ID: ${user.id})`);
    });
    
    // Remover todos os usuários
    console.log('Removendo todos os usuários do banco de dados...');
    const deleteResult = await db.delete(users).returning();
    
    console.log(`${deleteResult.length} usuário(s) removido(s) com sucesso!`);
    console.log('A rota /setup agora está disponível novamente.');
    console.log('Você pode acessar /setup para criar um novo usuário administrador.');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao resetar o sistema:');
    console.error(error);
    process.exit(1);
  }
}

// Executar a função
resetSetup(); 