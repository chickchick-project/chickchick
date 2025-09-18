/*
  Warnings:

  - A unique constraint covering the columns `[collection_image_id]` on the table `user_collections` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `collection_image_id` to the `user_collections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_collections" ADD COLUMN     "collection_image_id" UUID NOT NULL,
ADD COLUMN     "comment" TEXT;

-- CreateTable
CREATE TABLE "collection_image" (
    "id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collection_id" UUID NOT NULL,

    CONSTRAINT "collection_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collection_image_collection_id_key" ON "collection_image"("collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_collections_collection_image_id_key" ON "user_collections"("collection_image_id");

-- AddForeignKey
ALTER TABLE "user_collections" ADD CONSTRAINT "user_collections_collection_image_id_fkey" FOREIGN KEY ("collection_image_id") REFERENCES "collection_image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
