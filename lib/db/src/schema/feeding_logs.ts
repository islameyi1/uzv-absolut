import { pgTable, text, serial, timestamp, real, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { feedTypesTable } from "./feed_types";
import { feedingStrategiesTable } from "./feeding_strategies";
import { poolsTable } from "./pools";
import { usersTable } from "./users";

export const feedingLogsTable = pgTable("feeding_logs", {
  id: serial("id").primaryKey(),
  poolId: integer("pool_id").notNull().references(() => poolsTable.id),
  feedTypeId: integer("feed_type_id").notNull().references(() => feedTypesTable.id),
  strategyId: integer("strategy_id").references(() => feedingStrategiesTable.id),
  quantityKg: real("quantity_kg").notNull(),
  logDate: date("log_date").notNull(),
  notes: text("notes"),
  createdBy: integer("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFeedingLogSchema = createInsertSchema(feedingLogsTable).omit({ id: true, createdAt: true });
export type InsertFeedingLog = z.infer<typeof insertFeedingLogSchema>;
export type FeedingLog = typeof feedingLogsTable.$inferSelect;
