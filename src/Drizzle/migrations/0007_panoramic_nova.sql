ALTER TABLE "users" ADD COLUMN "IsVerified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification_code" varchar(10);