import { z } from "zod";
import { PostCategory } from "@prisma/client";

export const postSchema = z.object({
  category: z.nativeEnum(PostCategory, {
    errorMap: () => ({ message: "카테고리를 선택해 주세요." }),
  }),
  title: z
    .string()
    .min(1, "제목을 입력해주세요.")
    .max(30, "제목 글자 수가 너무 많습니다."),
  content: z.string().min(1),
  thumbnailUrl: z.string().nullable(),
});

export type TPostFormData = z.infer<typeof postSchema>;
