import { pgTable, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { gyms } from "./gym.schema";
import { product } from "./product.schema";
import { productFeature } from "./productFeature.schema";

export const productFeatureLink = pgTable(
  "product_feature_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gymId: uuid("gym_id")
      .notNull()
      .references(() => gyms.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    featureId: uuid("feature_id")
      .notNull()
      .references(() => productFeature.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("product_feature_links_product_id_feature_id_unique").on(
      table.productId,
      table.featureId
    ),
  ]
);
