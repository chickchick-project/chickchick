import { z } from "zod";

export const postSchema = z.object({
  category: z.string().min(1, "카테고리를 선택해주세요."),
  title: z
    .string()
    .min(3, "제목은 최소 3글자 이상 입력해주세요.")
    .max(100, "제목 글자 수가 너무 많습니다."),
  content: z.string().min(1, "내용을 입력해주세요."),
  thumbnailUrl: z.string().nullable(),
});

export type TPostFormData = z.infer<typeof postSchema>;
