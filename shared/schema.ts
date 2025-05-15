import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Developer schema
export const developers = pgTable("developers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const insertDeveloperSchema = createInsertSchema(developers).pick({
  email: true,
  password: true,
});

export type InsertDeveloper = z.infer<typeof insertDeveloperSchema>;
export type Developer = typeof developers.$inferSelect;

// App schema
export const apps = pgTable("apps", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  apiKey: text("api_key").notNull(),
  developerId: text("developer_id").notNull(),
  organizationId: uuid("organization_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  programId: text("program_id"),
  deployedEndpoint: text("deployed_endpoint"),
  deployedAt: timestamp("deployed_at"),
});

export const insertAppSchema = createInsertSchema(apps).pick({
  name: true,
  developerId: true,
  organizationId: true,
  programId: true,
  deployedEndpoint: true,
  deployedAt: true,
});

export type InsertApp = z.infer<typeof insertAppSchema>;
export type App = typeof apps.$inferSelect;

// Define the Analytics type based on API spec
export const analyticsSchema = z.object({
  appId: z.string(),
  totalUsers: z.number(),
  activeUsersLast24h: z.number(),
  registrationsLast7d: z.number()
});

export type Analytics = z.infer<typeof analyticsSchema>;

// Auth response schema
export const authResponseSchema = z.object({
  succeeded: z.boolean(),
  message: z.string(),
  token: z.string().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

// App response schema 
export const appResponseSchema = z.object({
  succeeded: z.boolean(),
  message: z.string(),
  id: z.string(),
  name: z.string(),
  apiKey: z.string(),
  developerId: z.string(),
  organizationId: z.string().optional(),
  createdAt: z.string(),
  programId: z.string().optional(),
  deployedEndpoint: z.string().optional(),
  deployedAt: z.string().optional(),
});

export type AppResponse = z.infer<typeof appResponseSchema>;
