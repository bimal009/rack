import { pgTable, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { memberMembership } from "./membershipPlan.schema";
import { gymFeature } from "./features.schema";

export const membershipFeature = pgTable(
  "membership_features",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    membershipId: uuid("membership_id")
      .notNull()
      .references(() => memberMembership.id, { onDelete: "cascade" }),
    featureId: uuid("feature_id")
      .notNull()
      .references(() => gymFeature.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("membership_features_membership_id_feature_id_unique").on(
      table.membershipId,
      table.featureId
    ),
  ]
);
