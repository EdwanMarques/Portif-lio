import * as dotenv from 'dotenv';
dotenv.config();
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Função para resetar a senha do usuário admin
async function resetAdminPassword() {
  try {
    // Obter o primeiro usuário (admin)
    const adminUsers = await db.select().from(users);
    
    if (adminUsers.length === 0) {
      console.error('Nenhum usuário admin encontrado no banco de dados.');
      process.exit(1);
    }
    
    const adminUser = adminUsers[0];
    console.log(`Usuário admin encontrado: ${adminUser.username}`);
    
    // Nova senha (você pode alterar isso para a senha desejada)
    const newPassword = 'admin123';
    
    // Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Atualizar a senha no banco de dados
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, adminUser.id));
    
    console.log(`Senha do usuário ${adminUser.username} foi resetada com sucesso!`);
    console.log(`Nova senha: ${newPassword}`);
    console.log('Por favor, altere esta senha após fazer login.');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao resetar a senha:', error);
    process.exit(1);
  }
}

// Executar a função
resetAdminPassword(); 