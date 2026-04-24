import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const poolsTable = pgTable("pools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shape: text("shape", { enum: ["rectangular", "circular", "oval"] }).notNull().default("rectangular"),
  length: real("length"),
  width: real("width"),
  diameter: real("diameter"),
  depth: real("depth").notNull(),
  volume: real("volume").notNull(),
  waterLevel: real("water_level"),
  drainType: text("drain_type", { enum: ["bottom", "side"] }).notNull().default("side"),
  farmId: integer("farm_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPoolSchema = createInsertSchema(poolsTable).omit({ id: true, createdAt: true });
export type InsertPool = z.infer<typeof insertPoolSchema>;
export type Pool = typeof poolsTable.$inferSelect;
