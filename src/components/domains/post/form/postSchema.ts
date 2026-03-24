import { z } from "zod";
import { PostCategory } from "@prisma/client";
import { PerfumeForPostSchema } from "@/server/hono/schemas/community.schema";

export const CreatePostClientSchema = z.object({
  category: z.nativeEnum(PostCategory, {
    errorMap: () => ({ message: "카테고리를 선택해 주세요." }),
  }),
  title: z
    .string()
    .min(1, "제목을 입력해주세요.")
    .max(30, "제목 글자 수가 너무 많습니다."),
  content: z.string().min(1, "내용을 입력해주세요."),
  contentText: z.string(),
  thumbnailUrl: z.string().nullable(),
  perfumeIds: z.array(z.string().uuid()).optional(),
  perfumes: z.array(PerfumeForPostSchema).optional(),
});

export type CreatePostClientInput = z.infer<typeof CreatePostClientSchema>;
