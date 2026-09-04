import { pgTable, pgEnum, integer, text, timestamp, uuid, date } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { member } from "./member.schema";
import { gymPlan } from "./gymPlan.schema";

export const gymMembershipStatusEnum = pgEnum("gym_membership_status", [
  "Active",
  "Paused",
  "Expired",
  "Cancelled",
]);

export const gymMembership = pgTable("gym_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  gymId: uuid("gym_id")
    .notNull()
    .references(() => gyms.id, { onDelete: "cascade" }),
  memberId: uuid("member_id")
    .notNull()
    .references(() => member.id, { onDelete: "cascade" }),
  planId: uuid("plan_id")
    .notNull()
    .references(() => gymPlan.id, { onDelete: "restrict" }),

  status: gymMembershipStatusEnum("status").notNull().default("Active"),

  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }).notNull(),
  pricePaid: integer("price_paid").notNull(),

  extendedDays: integer("extended_days").notNull().default(0),
  extensionReason: text("extension_reason"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
