import { pgTable, timestamp, uuid, varchar, unique } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";

export const productFeature = pgTable(
  "product_features",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("product_features_gym_id_name_unique").on(table.gymId, table.name),
  ]
);
