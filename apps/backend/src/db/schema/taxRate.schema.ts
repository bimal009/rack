import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  doublePrecision,
  unique,
} from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";

export const taxRate = pgTable(
  "tax_rates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 120 }).notNull(),
    rate: doublePrecision("rate").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique("tax_rates_gym_id_name_unique").on(table.gymId, table.name)]
);
