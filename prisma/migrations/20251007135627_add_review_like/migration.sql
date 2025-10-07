-- CreateTable
CREATE TABLE "public"."review_likes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "review_id" UUID NOT NULL,

    CONSTRAINT "review_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "review_likes_user_id_review_id_key" ON "public"."review_likes"("user_id", "review_id");

-- AddForeignKey
ALTER TABLE "public"."review_likes" ADD CONSTRAINT "review_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review_likes" ADD CONSTRAINT "review_likes_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
