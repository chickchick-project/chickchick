/*
  Warnings:

  - You are about to drop the column `collection_image_id` on the `user_collections` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_collections" DROP CONSTRAINT "user_collections_collection_image_id_fkey";

-- DropIndex
DROP INDEX "user_collections_collection_image_id_key";

-- AlterTable
ALTER TABLE "user_collections" DROP COLUMN "collection_image_id";

-- AddForeignKey
ALTER TABLE "collection_image" ADD CONSTRAINT "collection_image_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "user_collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
