import { pgTable, pgEnum, uuid, varchar, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { user } from "./user.schema";

export const businessTypeEnum = pgEnum("business_type", [
  "gym",
  "fitness-studio",
  "yoga-pilates",
  "martial-arts",
  "personal-training",
  "something-else",
]);

export const gyms = pgTable("gyms", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerUserId: text("owner_user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  businessType: businessTypeEnum("business_type").notNull(),
    specialties: jsonb("specialties").notNull().default([]),

  slug: varchar("slug", { length: 255 }).notNull().unique("gyms_slug_unique"),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 20 }).notNull().unique("gyms_phone_unique"),
  email: varchar("email", { length: 255 }).notNull().unique("gyms_email_unique"),
  website: varchar("website", { length: 255 }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

