import { pgTable, serial, timestamp, integer, real, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const measurementsTable = pgTable("measurements", {
  id: serial("id").primaryKey(),
  poolId: integer("pool_id").notNull(),
  temperature: real("temperature").notNull(),
  ph: real("ph").notNull(),
  oxygen: real("oxygen").notNull(),
  ammonia: real("ammonia").notNull(),
  nitrites: real("nitrites").notNull(),
  nitrates: real("nitrates").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMeasurementSchema = createInsertSchema(measurementsTable).omit({ id: true, createdAt: true });
export type InsertMeasurement = z.infer<typeof insertMeasurementSchema>;
export type Measurement = typeof measurementsTable.$inferSelect;
