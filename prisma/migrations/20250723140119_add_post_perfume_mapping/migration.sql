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
ALTER TABLE "reviews" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_activities" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_collections" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
