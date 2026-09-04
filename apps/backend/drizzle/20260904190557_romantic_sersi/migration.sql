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
ALTER TABLE "gym_plan_operating_hour_overrides" ADD CONSTRAINT "gym_plan_operating_hour_overrides_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_plan_operating_hour_overrides" ADD CONSTRAINT "gym_plan_operating_hour_overrides_plan_id_gym_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "gym_plans"("id") ON DELETE CASCADE;