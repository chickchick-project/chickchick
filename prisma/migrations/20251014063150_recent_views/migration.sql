-- CreateTable
CREATE TABLE "public"."recent_perfume_views" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "perfume_id" UUID NOT NULL,
    "viewed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recent_perfume_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recent_post_views" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "viewed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recent_post_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recent_perfume_views_user_id_viewed_at_idx" ON "public"."recent_perfume_views"("user_id", "viewed_at");

-- CreateIndex
CREATE UNIQUE INDEX "recent_perfume_views_user_id_perfume_id_key" ON "public"."recent_perfume_views"("user_id", "perfume_id");

-- CreateIndex
CREATE INDEX "recent_post_views_user_id_viewed_at_idx" ON "public"."recent_post_views"("user_id", "viewed_at");

-- CreateIndex
CREATE UNIQUE INDEX "recent_post_views_user_id_post_id_key" ON "public"."recent_post_views"("user_id", "post_id");

-- AddForeignKey
ALTER TABLE "public"."recent_perfume_views" ADD CONSTRAINT "recent_perfume_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."recent_perfume_views" ADD CONSTRAINT "recent_perfume_views_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "public"."perfumes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."recent_post_views" ADD CONSTRAINT "recent_post_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."recent_post_views" ADD CONSTRAINT "recent_post_views_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
