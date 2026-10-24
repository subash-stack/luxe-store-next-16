CREATE TYPE "public"."order_status" AS ENUM('placed', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "status" "order_status" DEFAULT 'placed' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_user_id_idx" ON "order" USING btree ("user_id");