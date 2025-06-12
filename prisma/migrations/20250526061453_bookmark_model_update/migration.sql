/*
  Warnings:

  - You are about to drop the `user_bookmarks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_bookmarks" DROP CONSTRAINT "user_bookmarks_user_id_fkey";

-- DropTable
DROP TABLE "user_bookmarks";

-- CreateTable
CREATE TABLE "post_bookmarks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfume_bookmarks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "perfume_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfume_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_bookmarks_user_id_post_id_key" ON "post_bookmarks"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "perfume_bookmarks_user_id_perfume_id_key" ON "perfume_bookmarks"("user_id", "perfume_id");

-- AddForeignKey
ALTER TABLE "post_bookmarks" ADD CONSTRAINT "post_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_bookmarks" ADD CONSTRAINT "post_bookmarks_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfume_bookmarks" ADD CONSTRAINT "perfume_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfume_bookmarks" ADD CONSTRAINT "perfume_bookmarks_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
