import * as dotenv from 'dotenv';
dotenv.config();
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Create Neon connection
const sql = neon(process.env.DATABASE_URL);
// Create drizzle database instance with schema
export const db = drizzle(sql, { schema });
