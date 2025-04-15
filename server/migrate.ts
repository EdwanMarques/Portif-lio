import * as dotenv from 'dotenv';
dotenv.config();

import { neon } from '@neondatabase/serverless';
import { users, contacts, projects } from '@shared/schema';

console.log('Starting migration script...');

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

console.log('DATABASE_URL is defined');

// Create Neon connection
const client = neon(process.env.DATABASE_URL);

console.log('Neon client created');

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // Drop existing tables if they exist
    console.log('Dropping existing tables...');
    await client`DROP TABLE IF EXISTS users CASCADE`;
    console.log('Users table dropped');
    await client`DROP TABLE IF EXISTS contacts CASCADE`;
    console.log('Contacts table dropped');
    await client`DROP TABLE IF EXISTS projects CASCADE`;
    console.log('Projects table dropped');
    await client`DROP TABLE IF EXISTS session CASCADE`;
    console.log('Session table dropped');
    
    // Create users table
    console.log('Creating users table...');
    await client`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;
    console.log('Users table created');
    
    // Create contacts table
    console.log('Creating contacts table...');
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
    console.log('Contacts table created');
    
    // Create projects table
    console.log('Creating projects table...');
    await client`
      CREATE TABLE projects (
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
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        featured_order TEXT,
        meta JSONB
      );
    `;
    console.log('Projects table created');
    
    // Create session table
    console.log('Creating session table...');
    await client`
      CREATE TABLE "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      );
    `;
    console.log('Session table created');
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

console.log('Calling migrate function...');
migrate().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});