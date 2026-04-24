import { pgTable, text, serial, timestamp, real, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { feedTypesTable } from "./feed_types";

export const feedingStrategiesTable = pgTable("feeding_strategies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  feedTypeId: integer("feed_type_id").references(() => feedTypesTable.id),
  dailyRatePct: real("daily_rate_pct").notNull(),
  feedingTimesPerDay: integer("feeding_times_per_day").notNull().default(4),
  notes: text("notes"),
  isPreset: boolean("is_preset").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFeedingStrategySchema = createInsertSchema(feedingStrategiesTable).omit({ id: true, createdAt: true });
export type InsertFeedingStrategy = z.infer<typeof insertFeedingStrategySchema>;
export type FeedingStrategy = typeof feedingStrategiesTable.$inferSelect;
