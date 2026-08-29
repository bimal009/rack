CREATE TABLE "gym_role_permission_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"gym_id" uuid NOT NULL,
	"role" "gym_role" NOT NULL,
	"permission_id" uuid NOT NULL,
	"granted" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gym_role_permission_overrides_gym_id_role_permission_id_unique" UNIQUE("gym_id","role","permission_id")
);
--> statement-breakpoint
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_gym_id_gyms_id_fkey";--> statement-breakpoint
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_gym_id_role_permission_id_unique";--> statement-breakpoint
ALTER TABLE "role_permissions" DROP COLUMN "gym_id";--> statement-breakpoint
ALTER TABLE "plans" ALTER COLUMN "duration_days" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_permission_id_unique" UNIQUE("role","permission_id");--> statement-breakpoint
ALTER TABLE "gym_role_permission_overrides" ADD CONSTRAINT "gym_role_permission_overrides_gym_id_gyms_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id");--> statement-breakpoint
ALTER TABLE "gym_role_permission_overrides" ADD CONSTRAINT "gym_role_permission_overrides_permission_id_permissions_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id");