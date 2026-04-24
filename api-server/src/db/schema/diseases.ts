import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const diseasesTable = pgTable("diseases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latinName: text("latin_name"),
  symptoms: text("symptoms").notNull(),
  causes: text("causes").notNull(),
  waterParameters: text("water_parameters"),
  treatment: text("treatment").notNull(),
  prevention: text("prevention").notNull(),
  photo: text("photo"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDiseaseSchema = createInsertSchema(diseasesTable).omit({ id: true, createdAt: true });
export type InsertDisease = z.infer<typeof insertDiseaseSchema>;
export type Disease = typeof diseasesTable.$inferSelect;
