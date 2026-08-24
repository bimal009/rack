CREATE TYPE "role" AS ENUM('owner', 'member', 'user', 'admin');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" DEFAULT 'user'::"role" NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "onboarded" boolean DEFAULT false NOT NULL;