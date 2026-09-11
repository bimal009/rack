ALTER TABLE "members" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "member_status";--> statement-breakpoint
CREATE TYPE "member_status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "status" SET DATA TYPE "member_status" USING "status"::"member_status";--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "status" SET DEFAULT 'Active'::"member_status";