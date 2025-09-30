/*
  Warnings:

  - You are about to drop the column `feeling` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `gender_tone` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `longevity` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `price_perception` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `season` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `sillage` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `time_of_day` on the `reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."reviews" DROP COLUMN "feeling",
DROP COLUMN "gender_tone",
DROP COLUMN "longevity",
DROP COLUMN "price_perception",
DROP COLUMN "season",
DROP COLUMN "sillage",
DROP COLUMN "time_of_day";

-- DropEnum
DROP TYPE "public"."Feeling";

-- DropEnum
DROP TYPE "public"."GenderTone";

-- DropEnum
DROP TYPE "public"."Longevity";

-- DropEnum
DROP TYPE "public"."PricePerception";

-- DropEnum
DROP TYPE "public"."Season";

-- DropEnum
DROP TYPE "public"."Sillage";

-- DropEnum
DROP TYPE "public"."TimeOfDay";

-- CreateTable
CREATE TABLE "public"."review_attributes" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "review_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attribute_options" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attribute_id" INTEGER NOT NULL,

    CONSTRAINT "attribute_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."review_attribute_selections" (
    "review_id" UUID NOT NULL,
    "attribute_option_id" INTEGER NOT NULL,

    CONSTRAINT "review_attribute_selections_pkey" PRIMARY KEY ("review_id","attribute_option_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "review_attributes_key_key" ON "public"."review_attributes"("key");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_options_attribute_id_value_key" ON "public"."attribute_options"("attribute_id", "value");

-- AddForeignKey
ALTER TABLE "public"."attribute_options" ADD CONSTRAINT "attribute_options_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "public"."review_attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review_attribute_selections" ADD CONSTRAINT "review_attribute_selections_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review_attribute_selections" ADD CONSTRAINT "review_attribute_selections_attribute_option_id_fkey" FOREIGN KEY ("attribute_option_id") REFERENCES "public"."attribute_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
