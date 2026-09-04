import { pgTable, uuid, varchar, timestamp, unique } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { gymPlan } from "./gymPlan.schema";
import { weekdayEnum } from "./gymOperatingHours.schema";

export const gymPlanOperatingHourOverride = pgTable(
  "gym_plan_operating_hour_overrides",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => gymPlan.id, { onDelete: "cascade" }),
    day: weekdayEnum("day").notNull(),
    open: varchar("open", { length: 5 }).notNull(),
    close: varchar("close", { length: 5 }).notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("gym_plan_operating_hour_overrides_gym_id_plan_id_day_unique").on(
      table.gymId,
      table.planId,
      table.day
    ),
  ]
);
