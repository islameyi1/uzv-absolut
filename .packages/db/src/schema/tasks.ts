import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tasksTable = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["todo", "in-progress", "done"] }).notNull().default("todo"),
  priority: text("priority", { enum: ["low", "medium", "high"] }).notNull().default("medium"),
  dueDate: text("due_date"),
  assignedTo: integer("assigned_to"),
  poolId: integer("pool_id"),
  createdBy: integer("created_by").notNull(),
  photo: text("photo"),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasksTable).omit({ id: true, createdAt: true });
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasksTable.$inferSelect;
