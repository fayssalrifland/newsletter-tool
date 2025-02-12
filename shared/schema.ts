import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const urls = pgTable("urls", {
  id: serial("id").primaryKey(),
  sourceUrl: text("source_url").notNull(),
  formUrl: text("form_url").notNull(),
});

export const insertUrlSchema = createInsertSchema(urls).pick({
  sourceUrl: true,
  formUrl: true,
});

export type InsertUrl = z.infer<typeof insertUrlSchema>;
export type Url = typeof urls.$inferSelect;