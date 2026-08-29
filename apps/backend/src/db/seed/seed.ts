import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../index";
import { defaultRolePermissions } from "./default-role-permissions";

const permissionCategories = [
  "profile",
  "notifications",
  "members",
  "memberships",
  "attendance",
  "schedule",
  "classes",
  "bookings",
  "products",
  "staff",
  "payroll",
  "pay_rates",
  "point_of_sale",
  "reports",
  "types",
  "website",
  "permissions",
  "settings",
] as const;

const actions = ["create", "read", "update", "delete"] as const;

async function seed() {
  const resourceAction = sql.join(
    permissionCategories.flatMap((resource) =>
      actions.map((action) => sql`(${resource}, ${action})`)
    ),
    sql`, `
  );

  await db.execute(sql`
    insert into permissions (resource, action)
    select v.resource, v.action::action
    from (values ${resourceAction}) as v(resource, action)
    on conflict (resource, action) do nothing
  `);

  const roleResourceAction = sql.join(
    defaultRolePermissions.map((entry) => {
      const [role, resource, action] = entry.split(":");
      return sql`(${role}, ${resource}, ${action})`;
    }),
    sql`, `
  );

  await db.execute(sql`
    insert into role_permissions (role, permission_id)
    select v.role::gym_role, p.id
    from (values ${roleResourceAction}) as v(role, resource, action)
    join permissions p on p.resource = v.resource and p.action = v.action::action
    on conflict (role, permission_id) do nothing
  `);

  console.log("Seeded permissions and role_permissions.");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => process.exit());
