/*
  Warnings:

  - You are about to drop the column `target_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `target_type` on the `comments` table. All the data in the column will be lost.
  - Added the required column `post_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_post_target_id_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_review_target_id_fkey";

-- DropIndex
DROP INDEX "comments_target_type_target_id_created_at_idx";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "target_id",
DROP COLUMN "target_type",
ADD COLUMN     "post_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "perfume_bookmarks" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "perfumes_image" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_collections" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;

-- DropEnum
DROP TYPE "CommentTargetType";

-- CreateIndex
CREATE INDEX "comments_post_id_created_at_idx" ON "comments"("post_id", "created_at");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
