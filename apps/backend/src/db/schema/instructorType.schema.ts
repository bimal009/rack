import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  text,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";

export const instructorType = pgTable(
  "instructor_types",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    description: text("description"),
    maxConcurrentBookings: integer("max_concurrent_bookings").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("instructor_types_gym_id_name_unique").on(table.gymId, table.name),
  ]
);
