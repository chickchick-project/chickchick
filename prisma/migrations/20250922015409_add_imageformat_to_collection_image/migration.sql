/*
  Warnings:

  - Added the required column `height` to the `collection_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `collection_image` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImageFormat" AS ENUM ('JPEG', 'PNG', 'WEBP', 'HEIC', 'UNKNOWN');

-- DropForeignKey
ALTER TABLE "collection_image" DROP CONSTRAINT "collection_image_collection_id_fkey";

-- AlterTable
ALTER TABLE "collection_image" ADD COLUMN     "format" "ImageFormat" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "collection_image" ADD CONSTRAINT "collection_image_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "user_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
