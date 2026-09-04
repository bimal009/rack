import { pgTable, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { memberMembership } from "./membershipPlan.schema";
import { gymSport } from "./sports.schema";

export const membershipSport = pgTable(
  "membership_sports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    membershipId: uuid("membership_id")
      .notNull()
      .references(() => memberMembership.id, { onDelete: "cascade" }),
    sportId: uuid("sport_id")
      .notNull()
      .references(() => gymSport.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("membership_sports_membership_id_sport_id_unique").on(
      table.membershipId,
      table.sportId
    ),
  ]
);
