import { z } from "zod";
import { PerfumeUsageStatus } from "@prisma/client";

/**
 * 클라이언트 전용 리뷰 속성 검증 스키마
 * 서버 스키마 의존성 없이 독립적으로 동작
 */
export const ReviewAttributesClientSchema = z.object({
  feeling: z.string().min(1, "이 향수에 대한 느낌을 선택해주세요."),
  longevity: z.string().min(1, "지속시간을 선택해주세요."),
  sillage: z.string().min(1, "잔향감을 선택해주세요."),
  genderTone: z.string().min(1, "향수가 떠오르게 하는 이미지를 선택해주세요."),
  season: z.array(z.string()).min(1, "계절을 최소 1개 이상 선택해야 합니다."),
  timeOfDay: z.string().min(1, "어울리는 시간대를 선택해주세요."),
  pricePerception: z.string().min(1, "가격에 대한 의견을 선택해주세요."),
});

/**
 * 클라이언트 전용 리뷰 생성 검증 스키마
 * Prisma 및 Hono 스키마 의존성 없음
 */
export const CreateReviewClientSchema = z.object({
  content: z.string(),
  usageStatus: z.nativeEnum(PerfumeUsageStatus),
  attributes: ReviewAttributesClientSchema,
});

export type CreateReviewClientInput = z.infer<typeof CreateReviewClientSchema>;
