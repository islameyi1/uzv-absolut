import { pgTable, text, serial, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { feedTypesTable } from "./feed_types";
import { farmsTable } from "./farms";

export const feedStockTable = pgTable("feed_stock", {
  id: serial("id").primaryKey(),
  feedTypeId: integer("feed_type_id").notNull().references(() => feedTypesTable.id),
  farmId: integer("farm_id").references(() => farmsTable.id),
  quantityKg: real("quantity_kg").notNull().default(0),
  minStockKg: real("min_stock_kg").default(10),
  notes: text("notes"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFeedStockSchema = createInsertSchema(feedStockTable).omit({ id: true, updatedAt: true });
export type InsertFeedStock = z.infer<typeof insertFeedStockSchema>;
export type FeedStock = typeof feedStockTable.$inferSelect;
