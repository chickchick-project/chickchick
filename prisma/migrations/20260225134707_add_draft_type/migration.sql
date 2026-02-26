/*
  Warnings:

  - A unique constraint covering the columns `[user_id,type]` on the table `post_drafts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DraftType" AS ENUM ('CREATE', 'UPDATE');

-- DropIndex
DROP INDEX "post_drafts_user_id_post_id_key";

-- AlterTable
ALTER TABLE "post_drafts" ADD COLUMN     "type" "DraftType" NOT NULL DEFAULT 'CREATE';

-- CreateIndex
CREATE UNIQUE INDEX "post_drafts_user_id_type_key" ON "post_drafts"("user_id", "type");
