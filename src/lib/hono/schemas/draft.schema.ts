import { z } from "@hono/zod-openapi";
import { PostCategory } from "@prisma/client";

/**
 * 임시 저장 생성 요청 바디 스키마
 * @description 게시글 임시 저장 시 사용되는 요청 데이터
 */
export const CreateDraftBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  contentText: z.string(),
  category: z.nativeEnum(PostCategory),
  thumbnailUrl: z.string().nullable(),
  perfumeIds: z.array(z.string().uuid()).optional(),
  postId: z.string().uuid().optional(),
});

/**
 * 임시 저장 생성 페이로드 스키마
 * @description 서비스 레이어에서 사용되는 임시 저장 생성 데이터 (작성자 ID 포함)
 */
export const CreateDraftPayloadSchema = CreateDraftBodySchema.extend({
  userId: z.string().uuid(),
});

/**
 * 임시 저장 응답 스키마
 * @description 임시 저장 조회/생성 시 반환되는 데이터
 */
export const ApiDraftResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  contentText: z.string(),
  category: z.nativeEnum(PostCategory),
  thumbnailUrl: z.string().nullable(),
  perfumeIds: z.array(z.string().uuid()),
  postId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * 임시 저장 목록 응답 스키마
 * @description 사용자의 임시 저장 목록 조회 시 반환되는 데이터
 */
export const ApiDraftListResponseSchema = z.array(ApiDraftResponseSchema);

/**
 * 임시 저장 성공 응답 스키마
 */
export const DraftSuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  draft: ApiDraftResponseSchema.optional(),
});

/**
 * 임시 저장 ID 파라미터 스키마
 * @description URL 경로에서 사용되는 임시 저장 ID 검증
 */
export const DraftIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateDraftBody = z.infer<typeof CreateDraftBodySchema>;
export type CreateDraftPayload = z.infer<typeof CreateDraftPayloadSchema>;
export type ApiDraftResponse = z.infer<typeof ApiDraftResponseSchema>;
export type ApiDraftListResponse = z.infer<typeof ApiDraftListResponseSchema>;
export type DraftSuccessResponse = z.infer<typeof DraftSuccessResponseSchema>;
