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
CREATE TABLE "product_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_categories_gym_id_name_unique" UNIQUE("gym_id","name")
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
CREATE TABLE "gym_sports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gym_sports_gym_id_name_unique" UNIQUE("gym_id","name")
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
ALTER TABLE "staff" DROP COLUMN "display_name";--> statement-breakpoint
ALTER TABLE "staff" DROP COLUMN "sports";--> statement-breakpoint
ALTER TABLE "area_types" ADD CONSTRAINT "area_types_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "class_types" ADD CONSTRAINT "class_types_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "instructor_types" ADD CONSTRAINT "instructor_types_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gym_sports" ADD CONSTRAINT "gym_sports_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tax_rates" ADD CONSTRAINT "tax_rates_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;