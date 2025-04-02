import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from './db';

// This script will run migrations on the database
async function migrateDb() {
  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: 'migrations' });
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

migrateDb();