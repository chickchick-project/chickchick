/*
  Warnings:

  - You are about to drop the column `name` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `perfumes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name_ko]` on the table `brands` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_en]` on the table `brands` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_ko]` on the table `perfumes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_en]` on the table `perfumes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_en` to the `brands` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `perfumes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('QUESTION', 'FREEBOARD', 'RECOMMENDATION');

-- CreateEnum
CREATE TYPE "PerfumeUsageStatus" AS ENUM ('CURRENTLY_USING', 'USED_BEFORE', 'NOT_USED_YET');

-- CreateEnum
CREATE TYPE "CommentTargetType" AS ENUM ('POST', 'REVIEW');

-- AlterTable
ALTER TABLE "brands" DROP COLUMN "name",
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_ko" TEXT;

-- AlterTable
ALTER TABLE "perfumes" DROP COLUMN "name",
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_ko" TEXT;

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "category" "PostCategory" NOT NULL DEFAULT 'FREEBOARD',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "thumbnail_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "perfume_id" UUID NOT NULL,
    "usage_status" "PerfumeUsageStatus" NOT NULL DEFAULT 'NOT_USED_YET',
    "tags" TEXT[],
    "image_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "target_type" "CommentTargetType" NOT NULL,
    "target_id" UUID NOT NULL,
    "parent_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comments_target_type_target_id_created_at_idx" ON "comments"("target_type", "target_id", "created_at");

-- CreateIndex
CREATE INDEX "comments_parent_id_created_at_idx" ON "comments"("parent_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_ko_key" ON "brands"("name_ko");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_en_key" ON "brands"("name_en");

-- CreateIndex
CREATE UNIQUE INDEX "perfumes_name_ko_key" ON "perfumes"("name_ko");

-- CreateIndex
CREATE UNIQUE INDEX "perfumes_name_en_key" ON "perfumes"("name_en");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
