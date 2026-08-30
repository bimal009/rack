import { pgTable, timestamp, uuid, varchar, unique } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";

export const planCategory = pgTable(
  "plan_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("plan_categories_gym_id_name_unique").on(table.gymId, table.name),
  ]
);
