/*
  Warnings:

  - Made the column `updated_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "public"."Longevity" ADD VALUE 'MODERATE';

-- DropForeignKey
ALTER TABLE "public"."post_perfume_mappings" DROP CONSTRAINT "post_perfume_mappings_perfume_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_perfume_mappings" DROP CONSTRAINT "post_perfume_mappings_post_id_fkey";

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "updated_at" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."perfume_likes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "perfume_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfume_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfume_likes_user_id_perfume_id_key" ON "public"."perfume_likes"("user_id", "perfume_id");

-- AddForeignKey
ALTER TABLE "public"."perfume_likes" ADD CONSTRAINT "perfume_likes_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "public"."perfumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."perfume_likes" ADD CONSTRAINT "perfume_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."post_perfume_mappings" ADD CONSTRAINT "post_perfume_mappings_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "public"."perfumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."post_perfume_mappings" ADD CONSTRAINT "post_perfume_mappings_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."post_likes" ADD CONSTRAINT "post_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
