import { pgTable, pgEnum, uuid, varchar, timestamp, unique } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";

export const weekdayEnum = pgEnum("weekday", [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

export const gymOperatingHour = pgTable(
  "gym_operating_hours",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    day: weekdayEnum("day").notNull(),
    open: varchar("open", { length: 5 }).notNull(),
    close: varchar("close", { length: 5 }).notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("gym_operating_hours_gym_id_day_unique").on(table.gymId, table.day),
  ]
);
