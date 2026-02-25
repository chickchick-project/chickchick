-- CreateTable
CREATE TABLE "post_drafts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "content_text" TEXT NOT NULL,
    "category" "PostCategory" NOT NULL DEFAULT 'FREEBOARD',
    "thumbnail_url" TEXT,
    "perfume_ids" UUID[],
    "post_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "post_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_drafts_user_id_updated_at_idx" ON "post_drafts"("user_id", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "post_drafts_user_id_post_id_key" ON "post_drafts"("user_id", "post_id");

-- AddForeignKey
ALTER TABLE "post_drafts" ADD CONSTRAINT "post_drafts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
