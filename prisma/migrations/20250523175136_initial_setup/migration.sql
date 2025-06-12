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

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL,
    "name" JSONB NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "map_location" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

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
    "name" JSONB NOT NULL,
    "brand_id" UUID NOT NULL,
    "image_url" TEXT,
    "official_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "perfumes_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "user_bookmarks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "item_type" "BookmarkItemType" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_collections" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "perfume_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_collections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfume_accords_name_ko_key" ON "perfume_accords"("name_ko");

-- CreateIndex
CREATE UNIQUE INDEX "perfume_accords_name_en_key" ON "perfume_accords"("name_en");

-- CreateIndex
CREATE UNIQUE INDEX "perfume_notes_name_ko_key" ON "perfume_notes"("name_ko");

-- CreateIndex
CREATE UNIQUE INDEX "perfume_notes_name_en_key" ON "perfume_notes"("name_en");

-- CreateIndex
CREATE UNIQUE INDEX "raw_perfume_page_url_key" ON "raw_perfume"("page_url");

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
CREATE UNIQUE INDEX "user_bookmarks_user_id_item_id_item_type_key" ON "user_bookmarks"("user_id", "item_id", "item_type");

-- CreateIndex
CREATE UNIQUE INDEX "user_collections_user_id_perfume_id_key" ON "user_collections"("user_id", "perfume_id");

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
ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_collections" ADD CONSTRAINT "user_collections_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_collections" ADD CONSTRAINT "user_collections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
