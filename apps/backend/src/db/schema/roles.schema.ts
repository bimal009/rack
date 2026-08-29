import { pgTable, timestamp, pgEnum, unique, uuid, boolean } from "drizzle-orm/pg-core";
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
    id: uuid("id").primaryKey().defaultRandom(),
    role: gymRoleEnum("role").notNull(),
    permissionId: uuid("permission_id").notNull().references(() => permission.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.role, table.permissionId)]
);

export const gymRolePermissionOverride = pgTable(
  "gym_role_permission_overrides",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id").notNull().references(() => gyms.id),
    role: gymRoleEnum("role").notNull(),
    permissionId: uuid("permission_id").notNull().references(() => permission.id),
    granted: boolean("granted").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.gymId, table.role, table.permissionId)]
);