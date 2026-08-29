ALTER TABLE "staff" ADD COLUMN "instructor_type_id" uuid;--> statement-breakpoint
ALTER TABLE "staff" DROP COLUMN "allow_admin_access";--> statement-breakpoint
ALTER TABLE "staff" DROP COLUMN "instructor_type";--> statement-breakpoint
ALTER TABLE "staff" DROP COLUMN "active_instructor";--> statement-breakpoint
ALTER TABLE "staff" ALTER COLUMN "experience" SET DATA TYPE integer USING "experience"::integer;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_instructor_type_id_instructor_types_id_fkey" FOREIGN KEY ("instructor_type_id") REFERENCES "instructor_types"("id") ON DELETE SET NULL;--> statement-breakpoint
DROP TYPE "instructor_type";