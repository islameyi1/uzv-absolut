import { pgTable, text, serial, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const feedTypesTable = pgTable("feed_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("dry"),
  pelletSize: real("pellet_size"),
  proteinPct: real("protein_pct"),
  fatPct: real("fat_pct"),
  energyKcal: real("energy_kcal"),
  manufacturer: text("manufacturer"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFeedTypeSchema = createInsertSchema(feedTypesTable).omit({ id: true, createdAt: true });
export type InsertFeedType = z.infer<typeof insertFeedTypeSchema>;
export type FeedType = typeof feedTypesTable.$inferSelect;
