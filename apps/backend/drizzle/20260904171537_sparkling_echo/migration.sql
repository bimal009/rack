ALTER TYPE "membership_billing_type" RENAME TO "gym_plan_billing_type";--> statement-breakpoint
ALTER TYPE "membership_billing_unit" RENAME TO "gym_plan_billing_unit";--> statement-breakpoint
ALTER TYPE "membership_coverage" RENAME TO "gym_plan_coverage";--> statement-breakpoint
ALTER TYPE "membership_visibility" RENAME TO "gym_plan_visibility";--> statement-breakpoint
ALTER TABLE "member_memberships" RENAME TO "gym_plans";--> statement-breakpoint
ALTER TABLE "membership_features" RENAME TO "gym_plan_features";--> statement-breakpoint
ALTER TABLE "membership_sports" RENAME TO "gym_plan_sports";--> statement-breakpoint
ALTER TABLE "gym_plan_features" RENAME COLUMN "membership_id" TO "plan_id";--> statement-breakpoint
ALTER TABLE "gym_plan_sports" RENAME COLUMN "membership_id" TO "plan_id";--> statement-breakpoint
ALTER TABLE "gym_plans" RENAME CONSTRAINT "member_memberships_custom_billing_check" TO "gym_plans_custom_billing_check";--> statement-breakpoint
ALTER TABLE "gym_plans" RENAME CONSTRAINT "member_memberships_gym_id_name_unique" TO "gym_plans_gym_id_name_unique";--> statement-breakpoint
ALTER TABLE "gym_plan_features" RENAME CONSTRAINT "membership_features_membership_id_feature_id_unique" TO "gym_plan_features_plan_id_feature_id_unique";--> statement-breakpoint
ALTER TABLE "gym_plan_sports" RENAME CONSTRAINT "membership_sports_membership_id_sport_id_unique" TO "gym_plan_sports_plan_id_sport_id_unique";