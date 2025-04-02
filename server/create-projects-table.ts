import { neon } from '@neondatabase/serverless';
import { projects } from '@shared/schema';

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Create Neon connection
const client = neon(process.env.DATABASE_URL);

async function createProjectsTable() {
  try {
    console.log('Creating projects table...');
    
    // Create the projects table
    await client`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        long_description TEXT,
        image TEXT NOT NULL,
        demo_url TEXT,
        repo_url TEXT,
        category TEXT NOT NULL,
        technologies TEXT[] NOT NULL,
        features TEXT[],
        screenshots TEXT[],
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        featured_order TEXT,
        meta JSONB
      );
    `;
    
    console.log('Projects table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating projects table:', error);
    process.exit(1);
  }
}

createProjectsTable();