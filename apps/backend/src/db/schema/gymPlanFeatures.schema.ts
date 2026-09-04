import { pgTable, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { gymPlan } from "./gymPlan.schema";
import { gymFeature } from "./features.schema";

export const gymPlanFeature = pgTable(
  "gym_plan_features",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => gymPlan.id, { onDelete: "cascade" }),
    featureId: uuid("feature_id")
      .notNull()
      .references(() => gymFeature.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("gym_plan_features_plan_id_feature_id_unique").on(
      table.planId,
      table.featureId
    ),
  ]
);
