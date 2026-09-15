CREATE TYPE "area_status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
CREATE TYPE "area_visibility" AS ENUM('Public', 'Private', 'Hidden');--> statement-breakpoint
CREATE TYPE "gym_membership_status" AS ENUM('Active', 'Paused', 'Expired', 'Cancelled');--> statement-breakpoint
CREATE TYPE "weekday" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');--> statement-breakpoint
CREATE TYPE "gym_plan_billing_type" AS ENUM('one_time', 'weekly', 'monthly', 'quarterly', 'annually', 'custom');--> statement-breakpoint
CREATE TYPE "gym_plan_billing_unit" AS ENUM('day', 'week', 'month');--> statement-breakpoint
CREATE TYPE "gym_plan_coverage" AS ENUM('Full access', 'Restricted');--> statement-breakpoint
CREATE TYPE "gym_plan_visibility" AS ENUM('Public', 'Private', 'Hidden');--> statement-breakpoint
CREATE TYPE "subscription_status" AS ENUM('active', 'expired', 'cancelled', 'past_due');--> statement-breakpoint
CREATE TYPE "member_gender" AS ENUM('Male', 'Female', 'Other', 'Prefer not to say');--> statement-breakpoint
CREATE TYPE "member_status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
CREATE TYPE "pay_rate_entrance_method" AS ENUM('All entrance methods', 'Direct payment', 'Any membership', 'Any external program');--> statement-breakpoint
CREATE TYPE "pay_rate_type" AS ENUM('class', 'individual');--> statement-breakpoint
CREATE TYPE "action" AS ENUM('create', 'read', 'update', 'delete');--> statement-breakpoint
CREATE TYPE "product_visibility" AS ENUM('Public', 'Private', 'Hidden');--> statement-breakpoint
CREATE TYPE "gym_role" AS ENUM('admin', 'manager', 'instructor', 'frontdesk');--> statement-breakpoint
CREATE TYPE "pay_type" AS ENUM('Hourly', 'Monthly', 'Per Class');--> statement-breakpoint
CREATE TYPE "staff_gender" AS ENUM('Male', 'Female', 'Other', 'Prefer not to say');--> statement-breakpoint
CREATE TYPE "staff_visibility" AS ENUM('Public', 'Private');--> statement-breakpoint
CREATE TYPE "role" AS ENUM('user', 'admin');--> statement-breakpoint
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
CREATE TABLE "area_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text,
	"sports" jsonb DEFAULT '[]' NOT NULL,
	"available_for_booking" boolean DEFAULT true NOT NULL,
	"price_per_hour" integer DEFAULT 0 NOT NULL,
	"max_players" integer DEFAULT 1 NOT NULL,
	"max_concurrent_bookings" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "area_types_gym_id_name_unique" UNIQUE("gym_id","name")
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "brands_gym_id_name_unique" UNIQUE("gym_id","name")
);
--> statement-breakpoint
CREATE TABLE "class_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text,
	"sports" jsonb DEFAULT '[]' NOT NULL,
	"available_for_booking" boolean DEFAULT true NOT NULL,
	"price_per_class" integer DEFAULT 0 NOT NULL,
	"max_participants" integer DEFAULT 1 NOT NULL,
	"max_concurrent_bookings" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "class_types_gym_id_name_unique" UNIQUE("gym_id","name")
);
--> statement-breakpoint
CREATE TABLE "gym_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gym_features_gym_id_name_unique" UNIQUE("gym_id","name")
);
--> statement-breakpoint
CREATE TABLE "gyms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"owner_user_id" text NOT NULL UNIQUE,
	"business_name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"phone" varchar(20) NOT NULL CONSTRAINT "gyms_phone_unique" UNIQUE,
	"email" varchar(255) NOT NULL CONSTRAINT "gyms_email_unique" UNIQUE,
	"website" varchar(255),
	"currency" varchar(3) DEFAULT 'NPR' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"status" "gym_membership_status" DEFAULT 'Active'::"gym_membership_status" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"price" integer NOT NULL,
	"signup_fee" integer,
	"extended_days" integer DEFAULT 0 NOT NULL,
	"extension_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"paused_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_operating_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"day" "weekday" NOT NULL,
	"open" varchar(5) NOT NULL,
	"close" varchar(5) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gym_operating_hours_gym_id_day_unique" UNIQUE("gym_id","day")
);
--> statement-breakpoint
CREATE TABLE "gym_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" text NOT NULL,
	"category_id" uuid NOT NULL,
	"visibility" "gym_plan_visibility" DEFAULT 'Public'::"gym_plan_visibility" NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"price_per_period" integer NOT NULL,
	"billing_type" "gym_plan_billing_type" NOT NULL,
	"billing_interval_unit" "gym_plan_billing_unit",
	"billing_interval_count" integer,
	"signup_fee" integer,
	"require_payment_upfront" boolean DEFAULT true NOT NULL,
	"coverage" "gym_plan_coverage" DEFAULT 'Full access'::"gym_plan_coverage" NOT NULL,
	"coverage_classes" jsonb,
	"coverage_areas" jsonb,
	"coverage_instructors" jsonb,
	"no_classes" boolean DEFAULT false NOT NULL,
	"no_areas" boolean DEFAULT false NOT NULL,
	"no_instructors" boolean DEFAULT false NOT NULL,
	"sessions" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gym_plans_gym_id_name_unique" UNIQUE("gym_id","name"),
	CONSTRAINT "gym_plans_custom_billing_check" CHECK ((
        "billing_type" = 'custom'
        AND "billing_interval_unit" IS NOT NULL
        AND "billing_interval_count" IS NOT NULL
        AND "billing_interval_count" > 0
      ) OR (
        "billing_type" <> 'custom'
        AND "billing_interval_unit" IS NULL
        AND "billing_interval_count" IS NULL
      ))
);
--> statement-breakpoint
CREATE TABLE "gym_plan_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"feature_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gym_plan_features_plan_id_feature_id_unique" UNIQUE("plan_id","feature_id")
);
--> statement-breakpoint
CREATE TABLE "gym_plan_operating_hour_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"day" "weekday" NOT NULL,
	"open" varchar(5) NOT NULL,
	"close" varchar(5) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gym_plan_operating_hour_overrides_gym_id_plan_id_day_unique" UNIQUE("gym_id","plan_id","day")
);
--> statement-breakpoint
CREATE TABLE "gym_plan_sports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"sport_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gym_plan_sports_plan_id_sport_id_unique" UNIQUE("plan_id","sport_id")
);
--> statement-breakpoint
CREATE TABLE "gym_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"billing_cycle" text DEFAULT 'monthly' NOT NULL,
	"status" "subscription_status" DEFAULT 'active'::"subscription_status" NOT NULL,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instructor_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text,
	"max_concurrent_bookings" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "instructor_types_gym_id_name_unique" UNIQUE("gym_id","name")
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"status" "member_status" DEFAULT 'Active'::"member_status" NOT NULL,
	"phone" varchar(20),
	"date_of_birth" date,
	"gender" "member_gender",
	"address" text,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "members_gym_id_user_id_unique" UNIQUE("gym_id","user_id")
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
CREATE TABLE "pay_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"type" "pay_rate_type" NOT NULL,
	"name" varchar(120) NOT NULL,
	"per_class_rate" double precision,
	"per_person_rate" double precision,
	"per_session_rate" double precision,
	"revenue_share_percent" double precision,
	"compensate_unpaid_bookings" boolean DEFAULT false NOT NULL,
	"class_type_id" uuid,
	"instructor_type_id" uuid,
	"entrance_method" "pay_rate_entrance_method" DEFAULT 'All entrance methods'::"pay_rate_entrance_method" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pay_rates_gym_id_name_unique" UNIQUE("gym_id","name")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"resource" text NOT NULL,
	"action" "action" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_resource_action_unique" UNIQUE("resource","action")
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"monthly_price" integer NOT NULL,
	"yearly_price" integer,
	"discount_percent" integer DEFAULT 0 NOT NULL,
	"max_members" integer,
	"duration_days" integer,
	"trial_days" integer DEFAULT 0 NOT NULL,
	"sms_enabled" boolean DEFAULT false NOT NULL,
	"email_enabled" boolean DEFAULT false NOT NULL,
	"reports_enabled" boolean DEFAULT false NOT NULL,
	"inventory_enabled" boolean DEFAULT false NOT NULL,
	"staff_enabled" boolean DEFAULT false NOT NULL,
	"website_enabled" boolean DEFAULT false NOT NULL,
	"re_engagement_enabled" boolean DEFAULT false NOT NULL,
	"attendance_enabled" boolean DEFAULT false NOT NULL,
	"door_lock_enabled" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" text NOT NULL,
	"category_id" uuid NOT NULL,
	"brand_id" uuid,
	"sku" text,
	"visibility" "product_visibility" DEFAULT 'Public'::"product_visibility" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"price" integer NOT NULL,
	"cost_price" integer,
	"tax_rate_id" uuid,
	"description" text,
	"images" jsonb DEFAULT '[]' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_gym_id_name_unique" UNIQUE("gym_id","name")
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_categories_gym_id_name_unique" UNIQUE("gym_id","name")
);
--> statement-breakpoint
CREATE TABLE "product_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_features_gym_id_name_unique" UNIQUE("gym_id","name")
);
--> statement-breakpoint
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
CREATE TABLE "gym_role_permission_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"role" "gym_role" NOT NULL,
	"permission_id" uuid NOT NULL,
	"granted" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gym_role_permission_overrides_gym_id_role_permission_id_unique" UNIQUE("gym_id","role","permission_id")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"role" "gym_role" NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "role_permissions_role_permission_id_unique" UNIQUE("role","permission_id")
);
--> statement-breakpoint
CREATE TABLE "gym_sports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gym_sports_gym_id_name_unique" UNIQUE("gym_id","name")
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "gym_role" NOT NULL,
	"is_owner" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"phone" varchar(20),
	"date_of_birth" date,
	"gender" "staff_gender",
	"address" text,
	"pay_type" "pay_type",
	"pay_rate" integer,
	"instructor_type_id" uuid,
	"experience" integer,
	"certifications" text,
	"can_be_booked" boolean DEFAULT false NOT NULL,
	"visibility" "staff_visibility" DEFAULT 'Public'::"staff_visibility" NOT NULL,
	"max_concurrent_bookings" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tax_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"rate" double precision DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tax_rates_gym_id_name_unique" UNIQUE("gym_id","name")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"issuer" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"token" text NOT NULL UNIQUE,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" "role" DEFAULT 'user'::"role" NOT NULL,
	"onboarded" boolean DEFAULT false NOT NULL,
	"is_claimed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "areas" ADD CONSTRAINT "areas_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "areas" ADD CONSTRAINT "areas_area_type_id_area_types_id_fkey" FOREIGN KEY ("area_type_id") REFERENCES "area_types"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "area_types" ADD CONSTRAINT "area_types_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "class_types" ADD CONSTRAINT "class_types_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_features" ADD CONSTRAINT "gym_features_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gyms" ADD CONSTRAINT "gyms_owner_user_id_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_memberships" ADD CONSTRAINT "gym_memberships_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_memberships" ADD CONSTRAINT "gym_memberships_member_id_members_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_memberships" ADD CONSTRAINT "gym_memberships_plan_id_gym_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "gym_plans"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "gym_operating_hours" ADD CONSTRAINT "gym_operating_hours_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_plans" ADD CONSTRAINT "gym_plans_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_plans" ADD CONSTRAINT "gym_plans_category_id_membership_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "membership_categories"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "gym_plan_features" ADD CONSTRAINT "gym_plan_features_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_plan_features" ADD CONSTRAINT "gym_plan_features_plan_id_gym_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "gym_plans"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_plan_features" ADD CONSTRAINT "gym_plan_features_feature_id_gym_features_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "gym_features"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_plan_operating_hour_overrides" ADD CONSTRAINT "gym_plan_operating_hour_overrides_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_plan_operating_hour_overrides" ADD CONSTRAINT "gym_plan_operating_hour_overrides_plan_id_gym_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "gym_plans"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_plan_sports" ADD CONSTRAINT "gym_plan_sports_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_plan_sports" ADD CONSTRAINT "gym_plan_sports_plan_id_gym_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "gym_plans"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_plan_sports" ADD CONSTRAINT "gym_plan_sports_sport_id_gym_sports_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "gym_sports"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_subscriptions" ADD CONSTRAINT "gym_subscriptions_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id");--> statement-breakpoint
ALTER TABLE "gym_subscriptions" ADD CONSTRAINT "gym_subscriptions_plan_id_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");--> statement-breakpoint
ALTER TABLE "instructor_types" ADD CONSTRAINT "instructor_types_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "membership_categories" ADD CONSTRAINT "membership_categories_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "pay_rates" ADD CONSTRAINT "pay_rates_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "pay_rates" ADD CONSTRAINT "pay_rates_class_type_id_class_types_id_fkey" FOREIGN KEY ("class_type_id") REFERENCES "class_types"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "pay_rates" ADD CONSTRAINT "pay_rates_instructor_type_id_instructor_types_id_fkey" FOREIGN KEY ("instructor_type_id") REFERENCES "instructor_types"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_tax_rate_id_tax_rates_id_fkey" FOREIGN KEY ("tax_rate_id") REFERENCES "tax_rates"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_features" ADD CONSTRAINT "product_features_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_feature_links" ADD CONSTRAINT "product_feature_links_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_feature_links" ADD CONSTRAINT "product_feature_links_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_feature_links" ADD CONSTRAINT "product_feature_links_feature_id_product_features_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "product_features"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_role_permission_overrides" ADD CONSTRAINT "gym_role_permission_overrides_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id");--> statement-breakpoint
ALTER TABLE "gym_role_permission_overrides" ADD CONSTRAINT "gym_role_permission_overrides_permission_id_permissions_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id");--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id");--> statement-breakpoint
ALTER TABLE "gym_sports" ADD CONSTRAINT "gym_sports_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id");--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_instructor_type_id_instructor_types_id_fkey" FOREIGN KEY ("instructor_type_id") REFERENCES "instructor_types"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "tax_rates" ADD CONSTRAINT "tax_rates_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;