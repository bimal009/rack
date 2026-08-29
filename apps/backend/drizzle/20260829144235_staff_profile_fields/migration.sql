CREATE TYPE "instructor_type" AS ENUM('None', 'Boxing Coach', 'Group Fitness Instructor', 'Personal Trainer', 'Yoga Instructor', 'Strength Coach');--> statement-breakpoint
CREATE TYPE "pay_type" AS ENUM('Hourly', 'Monthly', 'Per Class');--> statement-breakpoint
CREATE TYPE "staff_gender" AS ENUM('Male', 'Female', 'Other', 'Prefer not to say');--> statement-breakpoint
CREATE TYPE "staff_visibility" AS ENUM('Public', 'Private');--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "allow_admin_access" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "gender" "staff_gender";--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "pay_type" "pay_type";--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "pay_rate" integer;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "display_name" varchar(255);--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "instructor_type" "instructor_type" DEFAULT 'None'::"instructor_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "sports" text;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "experience" text;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "certifications" text;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "can_be_booked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "visibility" "staff_visibility" DEFAULT 'Public'::"staff_visibility" NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "max_concurrent_bookings" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "active_instructor" boolean DEFAULT true NOT NULL;