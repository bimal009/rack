import { pgTable, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { gymPlan } from "./gymPlan.schema";
import { gymSport } from "./sports.schema";

export const gymPlanSport = pgTable(
  "gym_plan_sports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => gymPlan.id, { onDelete: "cascade" }),
    sportId: uuid("sport_id")
      .notNull()
      .references(() => gymSport.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("gym_plan_sports_plan_id_sport_id_unique").on(
      table.planId,
      table.sportId
    ),
  ]
);
