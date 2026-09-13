ALTER TABLE "gym_memberships" ADD COLUMN "price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "gym_memberships" ADD COLUMN "signup_fee" integer;--> statement-breakpoint
ALTER TABLE "gym_memberships" DROP COLUMN "price_paid";