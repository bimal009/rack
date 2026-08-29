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

export const areaType = pgTable(
  "area_types",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description"),
    sports: jsonb("sports").$type<string[]>().notNull().default([]),
    availableForBooking: boolean("available_for_booking").notNull().default(true),
    pricePerHour: integer("price_per_hour").notNull().default(0),
    maxPlayers: integer("max_players").notNull().default(1),
    maxConcurrentBookings: integer("max_concurrent_bookings").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique("area_types_gym_id_name_unique").on(table.gymId, table.name)]
);
