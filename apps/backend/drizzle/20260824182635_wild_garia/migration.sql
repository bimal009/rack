CREATE TYPE "business_type" AS ENUM('gym', 'fitness-studio', 'yoga-pilates', 'martial-arts', 'personal-training', 'something-else');--> statement-breakpoint
CREATE TABLE "gyms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"owner_user_id" text NOT NULL UNIQUE,
	"business_type" "business_type" NOT NULL,
	"specialties" jsonb DEFAULT '[]' NOT NULL,
	"slug" varchar(255) NOT NULL CONSTRAINT "gyms_slug_unique" UNIQUE,
	"business_name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"phone" varchar(20) NOT NULL CONSTRAINT "gyms_phone_unique" UNIQUE,
	"email" varchar(255) NOT NULL CONSTRAINT "gyms_email_unique" UNIQUE,
	"website" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gyms" ADD CONSTRAINT "gyms_owner_user_id_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "user"("id") ON DELETE CASCADE;