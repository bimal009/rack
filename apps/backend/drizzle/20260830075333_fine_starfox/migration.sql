CREATE TYPE "pay_rate_entrance_method" AS ENUM('All entrance methods', 'Direct payment', 'Any membership', 'Any external program');--> statement-breakpoint
CREATE TYPE "pay_rate_type" AS ENUM('class', 'individual');--> statement-breakpoint
CREATE TABLE "gym_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gym_features_gym_id_name_unique" UNIQUE("gym_id","name")
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
ALTER TABLE "gym_features" ADD CONSTRAINT "gym_features_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "pay_rates" ADD CONSTRAINT "pay_rates_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "pay_rates" ADD CONSTRAINT "pay_rates_class_type_id_class_types_id_fkey" FOREIGN KEY ("class_type_id") REFERENCES "class_types"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "pay_rates" ADD CONSTRAINT "pay_rates_instructor_type_id_instructor_types_id_fkey" FOREIGN KEY ("instructor_type_id") REFERENCES "instructor_types"("id") ON DELETE SET NULL;