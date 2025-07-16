CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('CREATED', 'LIKED');

-- CreateEnum
CREATE TYPE "ActivityTargetType" AS ENUM ('REVIEW', 'POST', 'COMMENT', 'PERFUME');

-- CreateEnum
CREATE TYPE "NoteStage" AS ENUM ('TOP', 'MIDDLE', 'BASE', 'NONE');

-- CreateEnum
CREATE TYPE "BookmarkItemType" AS ENUM ('POST', 'PERFUME');

-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('QUESTION', 'FREEBOARD', 'RECOMMENDATION');

-- CreateEnum
CREATE TYPE "PerfumeUsageStatus" AS ENUM ('CURRENTLY_USING', 'USED_BEFORE', 'NOT_USED_YET');

-- CreateEnum
CREATE TYPE "CommentTargetType" AS ENUM ('POST', 'REVIEW');

-- CreateTable
CREATE TABLE "raw_perfume" (
    "id" UUID NOT NULL,
    "perfume_name" TEXT NOT NULL,
    "brand_name" TEXT NOT NULL,
    "page_url" TEXT NOT NULL,
    "image_url" TEXT,
    "accords" TEXT[],
    "notes" JSONB,

    CONSTRAINT "raw_perfume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "map_location" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ko" TEXT,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfume_accords" (
    "id" UUID NOT NULL,
    "name_ko" TEXT,
    "name_en" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "perfume_accords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfume_notes" (
    "id" UUID NOT NULL,
    "name_ko" TEXT,
    "name_en" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "perfume_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfumes" (
    "id" UUID NOT NULL,
    "brand_id" UUID NOT NULL,
    "official_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ko" TEXT,

    CONSTRAINT "perfumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "auth_id" UUID NOT NULL,
    "email" TEXT,
    "nickname" TEXT NOT NULL,
    "age" INTEGER,
    "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "role" TEXT DEFAULT 'user',
    "image_url" TEXT,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfume_accord_mappings" (
    "id" UUID NOT NULL,
    "perfume_id" UUID NOT NULL,
    "accord_id" UUID NOT NULL,

    CONSTRAINT "perfume_accord_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfume_note_mappings" (
    "id" UUID NOT NULL,
    "perfume_id" UUID NOT NULL,
    "note_id" UUID NOT NULL,
    "note_stage" "NoteStage" NOT NULL DEFAULT 'NONE',

    CONSTRAINT "perfume_note_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "target_type" "ActivityTargetType" NOT NULL,
    "target_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfume_bookmarks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "perfume_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perfume_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_collections" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "perfume_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_bookmarks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_likes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "category" "PostCategory" NOT NULL DEFAULT 'FREEBOARD',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "thumbnail_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "perfume_id" UUID NOT NULL,
    "usage_status" "PerfumeUsageStatus" NOT NULL DEFAULT 'NOT_USED_YET',
    "tags" TEXT[],
    "image_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "target_type" "CommentTargetType" NOT NULL,
    "target_id" UUID NOT NULL,
    "parent_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfumes_image" (
    "id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "perfume_id" UUID NOT NULL,

    CONSTRAINT "perfumes_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "raw_perfume_page_url_key" ON "raw_perfume"("page_url");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_en_key" ON "brands"("name_en");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_ko_key" ON "brands"("name_ko");

-- CreateIndex
CREATE UNIQUE INDEX "perfume_accords_name_ko_key" ON "perfume_accords"("name_ko");

-- CreateIndex
CREATE UNIQUE INDEX "perfume_accords_name_en_key" ON "perfume_accords"("name_en");

-- CreateIndex
CREATE UNIQUE INDEX "perfume_notes_name_en_key" ON "perfume_notes"("name_en");

-- CreateIndex
CREATE UNIQUE INDEX "perfumes_name_en_key" ON "perfumes"("name_en");

-- CreateIndex
CREATE UNIQUE INDEX "perfumes_name_ko_key" ON "perfumes"("name_ko");

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_id_key" ON "users"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_nickname_key" ON "users"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "perfume_accord_mappings_perfume_id_accord_id_key" ON "perfume_accord_mappings"("perfume_id", "accord_id");

-- CreateIndex
CREATE UNIQUE INDEX "perfume_note_mappings_perfume_id_note_id_key" ON "perfume_note_mappings"("perfume_id", "note_id");

-- CreateIndex
CREATE UNIQUE INDEX "perfume_bookmarks_user_id_perfume_id_key" ON "perfume_bookmarks"("user_id", "perfume_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_collections_user_id_perfume_id_key" ON "user_collections"("user_id", "perfume_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_bookmarks_user_id_post_id_key" ON "post_bookmarks"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_likes_user_id_post_id_key" ON "post_likes"("user_id", "post_id");

-- CreateIndex
CREATE INDEX "comments_target_type_target_id_created_at_idx" ON "comments"("target_type", "target_id", "created_at");

-- CreateIndex
CREATE INDEX "comments_parent_id_created_at_idx" ON "comments"("parent_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "perfumes_image_perfume_id_key" ON "perfumes_image"("perfume_id");

-- AddForeignKey
ALTER TABLE "perfumes" ADD CONSTRAINT "perfumes_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfume_accord_mappings" ADD CONSTRAINT "perfume_accord_mappings_accord_id_fkey" FOREIGN KEY ("accord_id") REFERENCES "perfume_accords"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfume_accord_mappings" ADD CONSTRAINT "perfume_accord_mappings_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfume_note_mappings" ADD CONSTRAINT "perfume_note_mappings_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "perfume_notes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfume_note_mappings" ADD CONSTRAINT "perfume_note_mappings_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfume_bookmarks" ADD CONSTRAINT "perfume_bookmarks_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "perfume_bookmarks" ADD CONSTRAINT "perfume_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_collections" ADD CONSTRAINT "user_collections_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_collections" ADD CONSTRAINT "user_collections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_bookmarks" ADD CONSTRAINT "post_bookmarks_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_bookmarks" ADD CONSTRAINT "post_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_review_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfumes_image" ADD CONSTRAINT "perfumes_image_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
