import { pgTable, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { member } from "./member.schema";

export const memberStatusEnum = pgEnum("member_status", [
  "active",
  "expired",
  "frozen",
  "cancelled",
]);

export const memberMembership = pgTable("member_memberships", {
  id: text("id").primaryKey(),
  memberId: text("member_id").notNull().references(() => member.id),
  gymId: text("gym_id").notNull().references(() => gyms.id),

  packageName: text("package_name").notNull(),
  price: integer("price").notNull(),

  status: memberStatusEnum("status").notNull().default("active"),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
