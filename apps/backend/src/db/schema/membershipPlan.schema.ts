import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  uuid,
  jsonb,
  unique,
  check,
} from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { membershipCategory } from "./membershipCategory.schema";

export const membershipVisibilityEnum = pgEnum("membership_visibility", [
  "Public",
  "Private",
  "Hidden",
]);

export const membershipBillingTypeEnum = pgEnum("membership_billing_type", [
  "one_time",
  "weekly",
  "monthly",
  "quarterly",
  "annually",
  "custom",
]);

export const membershipBillingUnitEnum = pgEnum("membership_billing_unit", [
  "day",
  "week",
  "month",
]);

export const membershipCoverageEnum = pgEnum("membership_coverage", [
  "Full access",
  "Restricted",
]);

export const memberMembership = pgTable(
  "member_memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => membershipCategory.id, { onDelete: "restrict" }),
    visibility: membershipVisibilityEnum("visibility").notNull().default("Public"),
    description: text("description"),
    barcode: text("barcode"),
    isActive: boolean("is_active").notNull().default(true),

    pricePerPeriod: integer("price_per_period").notNull(),
    billingType: membershipBillingTypeEnum("billing_type").notNull(),
    billingIntervalUnit: membershipBillingUnitEnum("billing_interval_unit"),
    billingIntervalCount: integer("billing_interval_count"),
    signupFee: integer("signup_fee"),
    requirePaymentUpfront: boolean("require_payment_upfront")
      .notNull()
      .default(true),

    coverage: membershipCoverageEnum("coverage").notNull().default("Full access"),
    coverageClasses: jsonb("coverage_classes").$type<string[]>(),
    coverageAreas: jsonb("coverage_areas").$type<string[]>(),
    coverageInstructors: jsonb("coverage_instructors").$type<string[]>(),
    noClasses: boolean("no_classes").notNull().default(false),
    noAreas: boolean("no_areas").notNull().default(false),
    noInstructors: boolean("no_instructors").notNull().default(false),
    sessions: text("sessions"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("member_memberships_gym_id_name_unique").on(table.gymId, table.name),
    check(
      "member_memberships_custom_billing_check",
      sql`(
        ${table.billingType} = 'custom'
        AND ${table.billingIntervalUnit} IS NOT NULL
        AND ${table.billingIntervalCount} IS NOT NULL
        AND ${table.billingIntervalCount} > 0
      ) OR (
        ${table.billingType} <> 'custom'
        AND ${table.billingIntervalUnit} IS NULL
        AND ${table.billingIntervalCount} IS NULL
      )`
    ),
  ]
);
