-- CreateEnum
CREATE TYPE "PointActivityType" AS ENUM ('CREATE_POST', 'CREATE_COMMENT', 'LIKE_POST', 'CONSECUTIVE_LOGIN_2', 'CONSECUTIVE_LOGIN_3', 'CONSECUTIVE_LOGIN_7');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "consecutive_login_days" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "last_login_date" TIMESTAMPTZ(6),
ADD COLUMN     "total_points" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "point_histories" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "point_amount" INTEGER NOT NULL,
    "activity_type" "PointActivityType" NOT NULL,
    "reference_id" UUID,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "point_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "point_histories_user_id_created_at_idx" ON "point_histories"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "point_histories_activity_type_idx" ON "point_histories"("activity_type");

-- AddForeignKey
ALTER TABLE "point_histories" ADD CONSTRAINT "point_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
