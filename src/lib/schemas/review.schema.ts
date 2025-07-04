import { PerfumeUsageStatusSchema } from "@prisma-zod/index";
import { z } from "zod";

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z
    .string()
    .max(500, { message: "500자 이내로 작성해 주세요." })
    .nullable(),
  authorId: z.string().uuid(),
  perfumeId: z.string().uuid(),
  usageStatus: PerfumeUsageStatusSchema,
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateReviewSchema = ReviewSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateReviewSchema = ReviewSchema.omit({
  id: true,
  title: true,
  createdAt: true,
  updatedAt: true,
});

export type Review = z.infer<typeof ReviewSchema>;
export type CreateReview = z.infer<typeof CreateReviewSchema>;
