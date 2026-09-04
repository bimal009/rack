import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  uuid,
  varchar,
  date,
  unique,
} from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { user } from "./user.schema";

export const memberGenderEnum = pgEnum("member_gender", [
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
]);

export const memberStatusEnum = pgEnum("member_status", [
  "Active",
  "On Hold",
  "Expired",
]);

export const member = pgTable(
  "members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    status: memberStatusEnum("status").notNull().default("Active"),

    phone: varchar("phone", { length: 20 }),
    dateOfBirth: date("date_of_birth", { mode: "string" }),
    gender: memberGenderEnum("gender"),
    address: text("address"),

    joinedAt: timestamp("joined_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("members_gym_id_user_id_unique").on(table.gymId, table.userId),
  ]
);
