CREATE TABLE "product_feature_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"feature_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_feature_links_product_id_feature_id_unique" UNIQUE("product_id","feature_id")
);
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "features";--> statement-breakpoint
ALTER TABLE "product_feature_links" ADD CONSTRAINT "product_feature_links_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_feature_links" ADD CONSTRAINT "product_feature_links_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_feature_links" ADD CONSTRAINT "product_feature_links_feature_id_product_features_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "product_features"("id") ON DELETE CASCADE;