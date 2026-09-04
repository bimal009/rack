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
} from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { productCategory } from "./productCategory.schema";
import { brand } from "./brand.schema";
import { taxRate } from "./taxRate.schema";

export const productVisibilityEnum = pgEnum("product_visibility", [
  "Public",
  "Private",
  "Hidden",
]);

// Retail product sold in the gym shop. Gym-scoped.
export const product = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => productCategory.id, { onDelete: "restrict" }),
    brandId: uuid("brand_id").references(() => brand.id, {
      onDelete: "set null",
    }),
    sku: text("sku"),
    visibility: productVisibilityEnum("visibility").notNull().default("Public"),
    isActive: boolean("is_active").notNull().default(true),

    price: integer("price").notNull(),
    costPrice: integer("cost_price"),
    taxRateId: uuid("tax_rate_id").references(() => taxRate.id, {
      onDelete: "set null",
    }),

    description: text("description"),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    images: jsonb("images").$type<string[]>().notNull().default([]),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("products_gym_id_name_unique").on(table.gymId, table.name),
  ]
);
