CREATE TYPE "gym_membership_status" AS ENUM('Active', 'Paused', 'Expired', 'Cancelled');--> statement-breakpoint
CREATE TABLE "gym_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"status" "gym_membership_status" DEFAULT 'Active'::"gym_membership_status" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"price_paid" integer NOT NULL,
	"extended_days" integer DEFAULT 0 NOT NULL,
	"extension_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gym_memberships" ADD CONSTRAINT "gym_memberships_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_memberships" ADD CONSTRAINT "gym_memberships_member_id_members_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_memberships" ADD CONSTRAINT "gym_memberships_plan_id_gym_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "gym_plans"("id") ON DELETE RESTRICT;