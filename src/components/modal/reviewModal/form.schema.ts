import { PerfumeUsageStatus } from "@prisma/client";
import { z } from "zod";

// TODO: ZodSchema<Review> 사용할 수 있도록 수정 필요함
export const reviewSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().nullable(),
  authorId: z.string(),
  perfumeId: z.string(),
  usageStatus: z.nativeEnum(PerfumeUsageStatus),
  tags: z.array(z.string()),
});
