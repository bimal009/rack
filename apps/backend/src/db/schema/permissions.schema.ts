import { pgTable, text, timestamp, pgEnum, unique, uuid } from "drizzle-orm/pg-core";

export const actionEnum = pgEnum("action", ["create", "read", "update", "delete"]);

export const permission = pgTable(
  "permissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    resource: text("resource").notNull(),
    action: actionEnum("action").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.resource, table.action)]
);
