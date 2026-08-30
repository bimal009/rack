import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  uuid,
  varchar,
  date,
  integer,
} from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { user } from "./user.schema";
import { gymRoleEnum } from "./roles.schema";
import { instructorType } from "./instructorType.schema";

export const payTypeEnum = pgEnum("pay_type", ["Hourly", "Monthly", "Per Class"]);

export const staffGenderEnum = pgEnum("staff_gender", [
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
]);

export const staffVisibilityEnum = pgEnum("staff_visibility", ["Public", "Private"]);

export const staff = pgTable("staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  gymId: uuid("gym_id").notNull().references(() => gyms.id),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  role: gymRoleEnum("role").notNull(),
  isOwner: boolean("is_owner").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),

  phone: varchar("phone", { length: 20 }),
  dateOfBirth: date("date_of_birth", { mode: "string" }),
  gender: staffGenderEnum("gender"),
  address: text("address"),
  payType: payTypeEnum("pay_type"),
  payRate: integer("pay_rate"),
  instructorTypeId: uuid("instructor_type_id").references(() => instructorType.id, {
    onDelete: "set null",
  }),
  experience: integer("experience"),
  certifications: text("certifications"),
  canBeBooked: boolean("can_be_booked").notNull().default(false),
  visibility: staffVisibilityEnum("visibility").notNull().default("Public"),
  maxConcurrentBookings: integer("max_concurrent_bookings").notNull().default(1),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
