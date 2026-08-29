import { pgTable, text, timestamp, pgEnum, unique } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { permission } from "./permissions.schema";

export const gymRoleEnum = pgEnum("gym_role", [
  "admin",
  "manager",
  "instructor",
  "frontdesk",
]);

export const rolePermission = pgTable(
  "role_permissions",
  {
    id: text("id").primaryKey(),
    gymId: text("gym_id").notNull().references(() => gyms.id),
    role: gymRoleEnum("role").notNull(),
    permissionId: text("permission_id").notNull().references(() => permission.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.gymId, table.role, table.permissionId)]
);
