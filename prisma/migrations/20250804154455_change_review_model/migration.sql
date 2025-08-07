/*
  Warnings:

  - The values [MODERATE] on the enum `Longevity` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `rating` on the `reviews` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Feeling" AS ENUM ('DISLIKE', 'BAD', 'NEUTRAL', 'GOOD', 'BEST');

-- AlterEnum
BEGIN;
CREATE TYPE "Longevity_new" AS ENUM ('VERY_WEAK', 'WEAK', 'LONG_LASTING');
ALTER TABLE "reviews" ALTER COLUMN "longevity" DROP DEFAULT;
ALTER TABLE "reviews" ALTER COLUMN "longevity" TYPE "Longevity_new" USING ("longevity"::text::"Longevity_new");
ALTER TYPE "Longevity" RENAME TO "Longevity_old";
ALTER TYPE "Longevity_new" RENAME TO "Longevity";
DROP TYPE "Longevity_old";
ALTER TABLE "reviews" ALTER COLUMN "longevity" SET DEFAULT 'VERY_WEAK';
COMMIT;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "rating",
ADD COLUMN     "feeling" "Feeling" NOT NULL DEFAULT 'DISLIKE';
