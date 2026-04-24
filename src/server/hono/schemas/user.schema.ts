import { z } from "@hono/zod-openapi";
import { UserModelSchema as UserSchema } from "@zod/schemas/variants/pure";

/**
 * 사용자 ID 경로 파라미터 스키마
 * @description URL 경로에서 사용되는 사용자 ID 검증
 */
export const UserIdParamSchema = z.object({
  userId: z
    .string()
    .uuid()
    .openapi({
      param: { name: "userId", in: "path" },
      example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    }),
});

/**
 * 사용자 프로필 응답 스키마
 * @description 사용자 프로필 조회 시 사용되는 응답 형식 (레벨 정보 포함)
 */
export const ApiUserProfileResponseSchema = UserSchema.pick({
  id: true,
  nickname: true,
  imageUrl: true,
  totalPoints: true,
})
  .extend({
    level: z.number().int().min(0),
  })
  .openapi("ApiUserProfileResponse");

/**
 * 리뷰 작성자 응답 스키마
 * @description 리뷰의 작성자 정보 응답 형식
 */
export const ApiReviewAuthorResponseSchema = UserSchema.pick({
  id: true,
  nickname: true,
  imageUrl: true,
}).openapi("ApiReviewAuthorResponse");

export type ApiUserProfileResponse = z.infer<
  typeof ApiUserProfileResponseSchema
>;

export type ApiReviewAuthorResponse = z.infer<
  typeof ApiReviewAuthorResponseSchema
>;
