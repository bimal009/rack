ALTER TABLE "gyms" DROP CONSTRAINT "gyms_slug_unique";--> statement-breakpoint
ALTER TABLE "gyms" DROP COLUMN "business_type";--> statement-breakpoint
ALTER TABLE "gyms" DROP COLUMN "slug";--> statement-breakpoint
DROP TYPE "business_type";