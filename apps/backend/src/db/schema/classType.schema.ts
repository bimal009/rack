import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";

export const classType = pgTable(
  "class_types",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description"),
    sports: jsonb("sports").$type<string[]>().notNull().default([]),
    availableForBooking: boolean("available_for_booking").notNull().default(true),
    pricePerClass: integer("price_per_class").notNull().default(0),
    maxParticipants: integer("max_participants").notNull().default(1),
    maxConcurrentBookings: integer("max_concurrent_bookings").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique("class_types_gym_id_name_unique").on(table.gymId, table.name)]
);
