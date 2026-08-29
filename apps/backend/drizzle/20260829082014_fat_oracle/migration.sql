CREATE TYPE "subscription_status" AS ENUM('active', 'expired', 'cancelled', 'past_due');--> statement-breakpoint
CREATE TYPE "gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "member_status" AS ENUM('active', 'expired', 'frozen', 'cancelled');--> statement-breakpoint
CREATE TYPE "action" AS ENUM('create', 'read', 'update', 'delete');--> statement-breakpoint
CREATE TYPE "gym_role" AS ENUM('admin', 'manager', 'instructor', 'frontdesk');--> statement-breakpoint
CREATE TABLE "gym_subscriptions" (
	"id" text PRIMARY KEY,
	"gym_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"billing_cycle" text DEFAULT 'monthly' NOT NULL,
	"status" "subscription_status" DEFAULT 'active'::"subscription_status" NOT NULL,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" text PRIMARY KEY,
	"gym_id" text NOT NULL,
	"user_id" text NOT NULL,
	"gender" "gender",
	"dob" timestamp,
	"address" text,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member_memberships" (
	"id" text PRIMARY KEY,
	"member_id" text NOT NULL,
	"gym_id" text NOT NULL,
	"package_name" text NOT NULL,
	"price" integer NOT NULL,
	"status" "member_status" DEFAULT 'active'::"member_status" NOT NULL,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" text PRIMARY KEY,
	"resource" text NOT NULL,
	"action" "action" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_resource_action_unique" UNIQUE("resource","action")
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"monthly_price" integer NOT NULL,
	"yearly_price" integer,
	"discount_percent" integer DEFAULT 0 NOT NULL,
	"max_members" integer,
	"duration_days" integer NOT NULL,
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
CREATE TABLE "role_permissions" (
	"id" text PRIMARY KEY,
	"gym_id" text NOT NULL,
	"role" "gym_role" NOT NULL,
	"permission_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "role_permissions_gym_id_role_permission_id_unique" UNIQUE("gym_id","role","permission_id")
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" text PRIMARY KEY,
	"gym_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "gym_role" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_claimed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "role";--> statement-breakpoint
CREATE TYPE "role" AS ENUM('user', 'admin');--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE "role" USING "role"::"role";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'::"role";--> statement-breakpoint
ALTER TABLE "gym_subscriptions" ADD CONSTRAINT "gym_subscriptions_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id");--> statement-breakpoint
ALTER TABLE "gym_subscriptions" ADD CONSTRAINT "gym_subscriptions_plan_id_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id");--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "member_memberships" ADD CONSTRAINT "member_memberships_member_id_members_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id");--> statement-breakpoint
ALTER TABLE "member_memberships" ADD CONSTRAINT "member_memberships_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id");--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id");--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id");--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id");--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;