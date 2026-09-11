import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.schema";

export const gyms = pgTable("gyms", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerUserId: text("owner_user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  businessName: varchar("business_name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 20 }).notNull().unique("gyms_phone_unique"),
  email: varchar("email", { length: 255 }).notNull().unique("gyms_email_unique"),
  website: varchar("website", { length: 255 }),
  currency: varchar("currency", { length: 3 }).notNull().default("NPR"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
