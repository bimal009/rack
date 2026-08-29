import { pgTable, text, timestamp, pgEnum, uuid } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { user } from "./user.schema";

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const member = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  gymId: uuid("gym_id").notNull().references(() => gyms.id),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }), 
  gender: genderEnum("gender"),
  dob: timestamp("dob"),
  address: text("address"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});