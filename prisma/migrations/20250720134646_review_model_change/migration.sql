/*
  Warnings:

  - You are about to drop the column `image_url` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `rating` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Longevity" AS ENUM ('VERY_WEAK', 'WEAK', 'MODERATE', 'LONG_LASTING');

-- CreateEnum
CREATE TYPE "Sillage" AS ENUM ('INTIMATE', 'MODERATE', 'STRONG');

-- CreateEnum
CREATE TYPE "GenderProfile" AS ENUM ('FEMININE', 'UNISEX', 'MASCULINE');

-- CreateEnum
CREATE TYPE "Season" AS ENUM ('SPRING', 'SUMMER', 'AUTUMN', 'WINTER');

-- CreateEnum
CREATE TYPE "TimeOfDay" AS ENUM ('DAY', 'NIGHT');

-- CreateEnum
CREATE TYPE "PricePerception" AS ENUM ('EXPENSIVE', 'REASONABLE', 'GOOD_VALUE');

-- AlterTable
ALTER TABLE "brands" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "perfume_accord_mappings" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "perfume_accords" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "perfume_bookmarks" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "perfume_note_mappings" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "perfume_notes" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "perfumes" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "perfumes_image" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "post_bookmarks" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "post_likes" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "image_url",
DROP COLUMN "tags",
ADD COLUMN     "gender_profile" "GenderProfile" NOT NULL DEFAULT 'UNISEX',
ADD COLUMN     "longevity" "Longevity" NOT NULL DEFAULT 'VERY_WEAK',
ADD COLUMN     "price_perception" "PricePerception" NOT NULL DEFAULT 'GOOD_VALUE',
ADD COLUMN     "rating" INTEGER NOT NULL,
ADD COLUMN     "season" "Season"[] DEFAULT ARRAY['SPRING']::"Season"[],
ADD COLUMN     "sillage" "Sillage" NOT NULL DEFAULT 'INTIMATE',
ADD COLUMN     "time_of_day" "TimeOfDay" NOT NULL DEFAULT 'DAY',
ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_activities" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_collections" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "reviews" DROP COLUMN "title";
