import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  image: text("image").notNull(),
  demoUrl: text("demo_url"),
  repoUrl: text("repo_url"),
  category: text("category").notNull(),
  technologies: text("technologies").array().notNull(),
  features: text("features").array(),
  screenshots: text("screenshots").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  featuredOrder: text("featured_order"),
  meta: jsonb("meta")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export const insertProjectSchema = createInsertSchema(projects)
  .omit({ id: true, createdAt: true })
  .extend({
    technologies: z.array(z.string()),
    features: z.array(z.string()).optional(),
    screenshots: z.array(z.string()).optional(),
    meta: z.record(z.string(), z.any()).optional()
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
