import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  status: text("status").default("offline").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Game schema
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  coverImage: text("cover_image").notNull(),
  rating: integer("rating").default(0),
  isInstalled: boolean("is_installed").default(false).notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  playMode: text("play_mode").notNull(), // SinglePlayer, Multiplayer, Co-op, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGameSchema = createInsertSchema(games).pick({
  title: true,
  description: true,
  category: true,
  coverImage: true,
  rating: true,
  isInstalled: true,
  isFavorite: true,
  playMode: true,
});

// Navigation schema
export const navigationItems = pgTable("navigation_items", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  path: text("path").notNull(),
  icon: text("icon").notNull(),
  isAdminOnly: boolean("is_admin_only").default(false).notNull(),
  sortOrder: integer("sort_order").notNull(),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNavigationItemSchema = createInsertSchema(navigationItems).pick({
  label: true,
  path: true,
  icon: true,
  isAdminOnly: true,
  sortOrder: true,
  parentId: true,
});

// UI Builder Layout schema
export const layouts = pgTable("layouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  components: json("components").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLayoutSchema = createInsertSchema(layouts).pick({
  name: true,
  components: true,
  isActive: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type NavigationItem = typeof navigationItems.$inferSelect;
export type InsertNavigationItem = z.infer<typeof insertNavigationItemSchema>;

export type Layout = typeof layouts.$inferSelect;
export type InsertLayout = z.infer<typeof insertLayoutSchema>;
