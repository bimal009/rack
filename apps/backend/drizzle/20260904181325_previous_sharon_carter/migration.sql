CREATE TYPE "member_gender" AS ENUM('Male', 'Female', 'Other', 'Prefer not to say');--> statement-breakpoint
CREATE TYPE "member_status" AS ENUM('Active', 'On Hold', 'Expired');--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "status" "member_status" DEFAULT 'Active'::"member_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "members" DROP COLUMN "dob";--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "gender" SET DATA TYPE "member_gender" USING "gender"::text::"member_gender";--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_gym_id_user_id_unique" UNIQUE("gym_id","user_id");--> statement-breakpoint
ALTER TABLE "members" DROP CONSTRAINT "members_gym_id_gyms_id_fkey", ADD CONSTRAINT "members_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE;--> statement-breakpoint
DROP TYPE "gender";