import {
  pgTable,
  pgEnum,
  timestamp,
  uuid,
  varchar,
  boolean,
  doublePrecision,
  unique,
} from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { classType } from "./classType.schema";
import { instructorType } from "./instructorType.schema";

export const payRateTypeEnum = pgEnum("pay_rate_type", ["class", "individual"]);

export const payRateEntranceMethodEnum = pgEnum("pay_rate_entrance_method", [
  "All entrance methods",
  "Direct payment",
  "Any membership",
  "Any external program",
]);

export const payRate = pgTable(
  "pay_rates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    type: payRateTypeEnum("type").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    perClassRate: doublePrecision("per_class_rate"),
    perPersonRate: doublePrecision("per_person_rate"),
    perSessionRate: doublePrecision("per_session_rate"),
    revenueSharePercent: doublePrecision("revenue_share_percent"),
    compensateUnpaidBookings: boolean("compensate_unpaid_bookings")
      .notNull()
      .default(false),
    classTypeId: uuid("class_type_id").references(() => classType.id, {
      onDelete: "set null",
    }),
    instructorTypeId: uuid("instructor_type_id").references(
      () => instructorType.id,
      { onDelete: "set null" }
    ),
    entranceMethod: payRateEntranceMethodEnum("entrance_method")
      .notNull()
      .default("All entrance methods"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique("pay_rates_gym_id_name_unique").on(table.gymId, table.name)]
);
