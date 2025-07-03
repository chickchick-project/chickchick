/*
  Warnings:

  - You are about to drop the column `image_url` on the `perfumes` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "perfume_notes_name_ko_key";

-- AlterTable
ALTER TABLE "brands" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

-- AlterTable
ALTER TABLE "perfume_accord_mappings" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

-- AlterTable
ALTER TABLE "perfume_accords" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

-- AlterTable
ALTER TABLE "perfume_note_mappings" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

-- AlterTable
ALTER TABLE "perfume_notes" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

-- AlterTable
ALTER TABLE "perfumes" DROP COLUMN "image_url",
ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "updated_at" DROP NOT NULL;

-- CreateTable
CREATE TABLE "perfume_search_index" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "perfume_id" UUID,
    "search_vector" tsvector,
    "type" TEXT,
    "priority" INTEGER,

    CONSTRAINT "perfume_search_index_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfumes_image" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "perfume_id" UUID NOT NULL,

    CONSTRAINT "perfumes_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfumes_image_perfume_id_key" ON "perfumes_image"("perfume_id");

-- AddForeignKey
ALTER TABLE "perfume_search_index" ADD CONSTRAINT "perfume_search_index_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfumes_image" ADD CONSTRAINT "perfumes_image_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
