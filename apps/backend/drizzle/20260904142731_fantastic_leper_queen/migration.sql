CREATE TYPE "area_status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
CREATE TYPE "area_visibility" AS ENUM('Public', 'Private', 'Hidden');--> statement-breakpoint
CREATE TYPE "membership_billing_type" AS ENUM('one_time', 'weekly', 'monthly', 'quarterly', 'annually', 'custom');--> statement-breakpoint
CREATE TYPE "membership_billing_unit" AS ENUM('day', 'week', 'month');--> statement-breakpoint
CREATE TYPE "membership_coverage" AS ENUM('Full access', 'Restricted');--> statement-breakpoint
CREATE TYPE "membership_visibility" AS ENUM('Public', 'Private', 'Hidden');--> statement-breakpoint
CREATE TABLE "areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"area_type_id" uuid,
	"name" varchar(120) NOT NULL,
	"description" text,
	"images" jsonb DEFAULT '[]' NOT NULL,
	"price_per_hour" integer DEFAULT 0 NOT NULL,
	"max_concurrent_bookings" integer DEFAULT 1 NOT NULL,
	"visibility" "area_visibility" DEFAULT 'Public'::"area_visibility" NOT NULL,
	"status" "area_status" DEFAULT 'Active'::"area_status" NOT NULL,
	"attributes" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "areas_gym_id_name_unique" UNIQUE("gym_id","name")
);
--> statement-breakpoint
CREATE TABLE "membership_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "membership_categories_gym_id_name_unique" UNIQUE("gym_id","name")
);
--> statement-breakpoint
CREATE TABLE "membership_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"membership_id" uuid NOT NULL,
	"feature_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "membership_features_membership_id_feature_id_unique" UNIQUE("membership_id","feature_id")
);
--> statement-breakpoint
CREATE TABLE "membership_sports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"membership_id" uuid NOT NULL,
	"sport_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "membership_sports_membership_id_sport_id_unique" UNIQUE("membership_id","sport_id")
);
--> statement-breakpoint
ALTER TABLE "member_memberships" DROP CONSTRAINT "member_memberships_member_id_members_id_fkey";--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "visibility" "membership_visibility" DEFAULT 'Public'::"membership_visibility" NOT NULL;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "price_per_period" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "billing_type" "membership_billing_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "billing_interval_unit" "membership_billing_unit";--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "billing_interval_count" integer;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "signup_fee" integer;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "require_payment_upfront" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "coverage" "membership_coverage" DEFAULT 'Full access'::"membership_coverage" NOT NULL;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "coverage_classes" jsonb;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "coverage_areas" jsonb;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "coverage_instructors" jsonb;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "no_classes" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "no_areas" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "no_instructors" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "sessions" text;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "is_owner" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "member_memberships" DROP COLUMN "member_id";--> statement-breakpoint
ALTER TABLE "member_memberships" DROP COLUMN "package_name";--> statement-breakpoint
ALTER TABLE "member_memberships" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "member_memberships" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "member_memberships" DROP COLUMN "starts_at";--> statement-breakpoint
ALTER TABLE "member_memberships" DROP COLUMN "ends_at";--> statement-breakpoint
ALTER TABLE "member_memberships" ADD CONSTRAINT "member_memberships_gym_id_name_unique" UNIQUE("gym_id","name");--> statement-breakpoint
ALTER TABLE "areas" ADD CONSTRAINT "areas_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "areas" ADD CONSTRAINT "areas_area_type_id_area_types_id_fkey" FOREIGN KEY ("area_type_id") REFERENCES "area_types"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "membership_categories" ADD CONSTRAINT "membership_categories_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "membership_features" ADD CONSTRAINT "membership_features_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "membership_features" ADD CONSTRAINT "membership_features_membership_id_member_memberships_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "member_memberships"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "membership_features" ADD CONSTRAINT "membership_features_feature_id_gym_features_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "gym_features"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD CONSTRAINT "member_memberships_category_id_membership_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "membership_categories"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "membership_sports" ADD CONSTRAINT "membership_sports_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "membership_sports" ADD CONSTRAINT "membership_sports_membership_id_member_memberships_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "member_memberships"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "membership_sports" ADD CONSTRAINT "membership_sports_sport_id_gym_sports_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "gym_sports"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "member_memberships" DROP CONSTRAINT "member_memberships_gym_id_gyms_id_fkey", ADD CONSTRAINT "member_memberships_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD CONSTRAINT "member_memberships_custom_billing_check" CHECK ((
        "billing_type" = 'custom'
        AND "billing_interval_unit" IS NOT NULL
        AND "billing_interval_count" IS NOT NULL
        AND "billing_interval_count" > 0
      ) OR (
        "billing_type" <> 'custom'
        AND "billing_interval_unit" IS NULL
        AND "billing_interval_count" IS NULL
      ));--> statement-breakpoint
DROP TYPE "member_status";