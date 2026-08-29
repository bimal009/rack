import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { plan } from "./plans.schema";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "expired",
  "cancelled",
  "past_due",
]);

export const gymSubscription = pgTable("gym_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  gymId: uuid("gym_id").notNull().references(() => gyms.id),
  planId: uuid("plan_id").notNull().references(() => plan.id),

  billingCycle: text("billing_cycle", { enum: ["monthly", "yearly"] }).notNull().default("monthly"),
  status: subscriptionStatusEnum("status").notNull().default("active"),

  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});