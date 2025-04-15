import * as dotenv from 'dotenv';
dotenv.config();
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Função para resetar a senha do usuário admin
async function resetAdminPassword() {
  try {
    console.log('Iniciando processo de reset de senha...');
    console.log('Conectando ao banco de dados...');
    
    // Obter o primeiro usuário (admin)
    console.log('Buscando usuários no banco de dados...');
    const adminUsers = await db.select().from(users);
    
    console.log(`Total de usuários encontrados: ${adminUsers.length}`);
    
    if (adminUsers.length === 0) {
      console.error('Nenhum usuário admin encontrado no banco de dados.');
      process.exit(1);
    }
    
    const adminUser = adminUsers[0];
    console.log(`Usuário admin encontrado: ${adminUser.username} (ID: ${adminUser.id})`);
    
    // Nova senha (você pode alterar isso para a senha desejada)
    const newPassword = 'admin123';
    
    console.log('Gerando hash para a nova senha...');
    // Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    console.log('Atualizando a senha no banco de dados...');
    // Atualizar a senha no banco de dados
    const updateResult = await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, adminUser.id))
      .returning();
    
    console.log(`Resultado da atualização: ${updateResult.length > 0 ? 'Sucesso' : 'Falha'}`);
    
    console.log(`Senha do usuário ${adminUser.username} foi resetada com sucesso!`);
    console.log(`Nova senha: ${newPassword}`);
    console.log('Por favor, altere esta senha após fazer login.');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao resetar a senha:');
    console.error(error);
    process.exit(1);
  }
}

// Executar a função
resetAdminPassword(); 