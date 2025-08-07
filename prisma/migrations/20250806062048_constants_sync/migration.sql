/*
  Warnings:

  - You are about to drop the column `gender_profile` on the `reviews` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GenderTone" AS ENUM ('FEMININE', 'UNISEX', 'MASCULINE');

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "gender_profile",
ADD COLUMN     "gender_tone" "GenderTone" NOT NULL DEFAULT 'UNISEX';

-- DropEnum
DROP TYPE "GenderProfile";
