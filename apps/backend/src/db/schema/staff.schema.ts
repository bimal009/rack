import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { user } from "./user.schema";
import { gymRoleEnum } from "./roles.schema";

export const staff = pgTable("staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  gymId: uuid("gym_id").notNull().references(() => gyms.id),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }), 
  role: gymRoleEnum("role").notNull(),
  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});