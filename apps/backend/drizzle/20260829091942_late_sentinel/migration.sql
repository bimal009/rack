ALTER TABLE "gym_subscriptions" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "gym_subscriptions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "gym_subscriptions" ALTER COLUMN "gym_id" SET DATA TYPE uuid USING "gym_id"::uuid;--> statement-breakpoint
ALTER TABLE "gym_subscriptions" ALTER COLUMN "plan_id" SET DATA TYPE uuid USING "plan_id"::uuid;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "gym_id" SET DATA TYPE uuid USING "gym_id"::uuid;--> statement-breakpoint
ALTER TABLE "member_memberships" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "member_memberships" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "member_memberships" ALTER COLUMN "member_id" SET DATA TYPE uuid USING "member_id"::uuid;--> statement-breakpoint
ALTER TABLE "member_memberships" ALTER COLUMN "gym_id" SET DATA TYPE uuid USING "gym_id"::uuid;--> statement-breakpoint
ALTER TABLE "permissions" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "permissions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "plans" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "plans" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "role_permissions" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "role_permissions" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "role_permissions" ALTER COLUMN "gym_id" SET DATA TYPE uuid USING "gym_id"::uuid;--> statement-breakpoint
ALTER TABLE "role_permissions" ALTER COLUMN "permission_id" SET DATA TYPE uuid USING "permission_id"::uuid;--> statement-breakpoint
ALTER TABLE "staff" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "staff" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "staff" ALTER COLUMN "gym_id" SET DATA TYPE uuid USING "gym_id"::uuid;