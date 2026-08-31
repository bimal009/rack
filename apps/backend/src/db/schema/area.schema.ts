import {
  pgTable,
  pgEnum,
  timestamp,
  uuid,
  varchar,
  text,
  integer,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { areaType } from "./areaType.schema";

export const areaVisibilityEnum = pgEnum("area_visibility", [
  "Public",
  "Private",
  "Hidden",
]);

export const areaStatusEnum = pgEnum("area_status", ["Active", "Inactive"]);

export const area = pgTable(
  "areas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    areaTypeId: uuid("area_type_id").references(() => areaType.id, {
      onDelete: "set null",
    }),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description"),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    pricePerHour: integer("price_per_hour").notNull().default(0),
    maxConcurrentBookings: integer("max_concurrent_bookings").notNull().default(1),
    visibility: areaVisibilityEnum("visibility").notNull().default("Public"),
    status: areaStatusEnum("status").notNull().default("Active"),
    attributes: jsonb("attributes").$type<string[]>().notNull().default([]),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique("areas_gym_id_name_unique").on(table.gymId, table.name)]
);
