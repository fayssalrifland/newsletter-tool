import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const urls = pgTable("urls", {
  id: serial("id").primaryKey(),
  sourceUrl: text("source_url").notNull(),
  formUrl: text("form_url").notNull(),
  hasFirstName: text("has_first_name"),
  hasLastName: text("has_last_name"),
  hasCheckbox: text("has_checkbox"),
  hasRadio: text("has_radio"),
});

export const insertUrlSchema = createInsertSchema(urls).pick({
  sourceUrl: true,
  formUrl: true,
  hasFirstName: true,
  hasLastName: true,
  hasCheckbox: true,
  hasRadio: true,
});

export type InsertUrl = z.infer<typeof insertUrlSchema>;
export type Url = typeof urls.$inferSelect;