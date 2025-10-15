import { z } from "zod";
import { ApiPostResponseSchema } from "./community.schema";
import { ApiPerfumeSimpleResponseSchema } from "./perfume.schema";
import { ApiReviewResponseSchema } from "./review.schema";
import { CommentResponseSchema } from "./comment.schema";
import {
  UserCollectionSchema,
  CollectionImageSchema,
  UserSchema,
} from "@zod/modelSchema";

export const ApiMyBookmarkedPostsResponseSchema = z.array(
  ApiPostResponseSchema
);

export const ApiMyBookmarkedPerfumesResponseSchema = z.array(
  ApiPerfumeSimpleResponseSchema
);
export const CreatePhotoCollectionRequestSchema = z.object({
  perfumeId: z.string().uuid(),
  comment: z.string().optional(),
});

export const ApiMyCollectionResponseSchema = UserCollectionSchema.pick({
  id: true,
  userId: true,
  perfumeId: true,
  comment: true,
  createdAt: true,
})
  .extend({
    image: CollectionImageSchema.pick({ id: true, imageUrl: true }).optional(),
  })
  .openapi("ApiMyCollectionResponse");

export const ApiMyReviewsResponseSchema = z.array(ApiReviewResponseSchema);
export const ApiMyPostsResponseSchema = z.array(ApiPostResponseSchema);
export const ApiMyCommentsResponseSchema = z.array(CommentResponseSchema);

export const DeleteCollectionParamSchema = z.object({
  collectionId: z.string().uuid(),
});

export const ApiMyLikedPerfumesResponseSchema = z.array(
  ApiPerfumeSimpleResponseSchema
);
export const ApiMyLikedPostsResponseSchema = z.array(ApiPostResponseSchema);

export const CreateCollectionInputSchema = z.object({
  perfumeId: z.string().uuid(),
  comment: z.string().optional(),
});

export const ApiMyProfileResponseSchema = UserSchema.pick({
  id: true,
  nickname: true,
  age: true,
  gender: true,
  imageUrl: true,
}).openapi("ApiMyProfileResponse");

export const ApiUpdateMyProfileRequestSchema = z
  .object({
    id: UserSchema.shape.id,
    nickname: UserSchema.shape.nickname.optional(),
    age: UserSchema.shape.age.optional(),
    gender: UserSchema.shape.gender.optional(),
  })
  .openapi("ApiUpdateMyProfileRequest");

export const ApiSyncRecentPostsRequestSchema = z
  .object({
    postIds: z.array(z.string().uuid()),
  })
  .openapi("ApiSyncRecentPostsRequest");

export const ApiSyncRecentPerfumesRequestSchema = z
  .object({
    perfumeIds: z.array(z.string().uuid()),
  })
  .openapi("ApiSyncRecentPerfumesRequest");

export const ApiSyncRecentPerfumesResponseSchema = z
  .object({
    receivedPerfumeIds: z.array(z.string().uuid()),
  })
  .openapi("ApiSyncRecentPerfumesResponse");

export const ApiSyncRecentPostsResponseSchema = z
  .object({
    receivedPostIds: z.array(z.string().uuid()),
  })
  .openapi("ApiSyncRecentPostsResponse");

export const ApiRecentPerfumeItemSchema = z
  .object({
    id: z.string().uuid(),
    viewedAt: z.string().datetime(),
    perfume: ApiPerfumeSimpleResponseSchema,
  })
  .openapi("ApiRecentPerfumeItem");

export const ApiGetRecentPerfumesResponseSchema = z
  .object({
    items: z.array(ApiRecentPerfumeItemSchema),
  })
  .openapi("ApiGetRecentPerfumesResponse");

export const ApiRecentPostItemSchema = z
  .object({
    id: z.string().uuid(),
    viewedAt: z.string().datetime(),
    post: ApiPostResponseSchema,
  })
  .openapi("ApiRecentPostItem");

export const ApiGetRecentPostsResponseSchema = z
  .object({
    items: z.array(ApiRecentPostItemSchema),
  })
  .openapi("ApiGetRecentPostsResponse");

export type ApiMyBookmarkedPostsResponse = z.infer<
  typeof ApiMyBookmarkedPostsResponseSchema
>;
export type ApiMyBookmarkedPerfumesResponse = z.infer<
  typeof ApiMyBookmarkedPerfumesResponseSchema
>;
export type ApiMyCollectionResponse = z.infer<
  typeof ApiMyCollectionResponseSchema
>;
export type ApiMyReviewsResponse = z.infer<typeof ApiMyReviewsResponseSchema>;
export type ApiMyPostsResponse = z.infer<typeof ApiMyPostsResponseSchema>;
export type ApiMyCommentsResponse = z.infer<typeof ApiMyCommentsResponseSchema>;
export type ApiMyLikedPerfumesResponse = z.infer<
  typeof ApiMyLikedPerfumesResponseSchema
>;
export type ApiMyLikedPostsResponse = z.infer<
  typeof ApiMyLikedPostsResponseSchema
>;
export type CreateCollectionInput = z.infer<typeof CreateCollectionInputSchema>;

export type ApiMyProfileResponse = z.infer<typeof ApiMyProfileResponseSchema>;
export type ApiUpdateMyProfileRequest = z.infer<
  typeof ApiUpdateMyProfileRequestSchema
>;

export type ApiSyncRecentPostsRequest = z.infer<
  typeof ApiSyncRecentPostsRequestSchema
>;

export type ApiRecentPostItem = z.infer<typeof ApiRecentPostItemSchema>;
export type ApiRecentPerfumeItem = z.infer<typeof ApiRecentPerfumeItemSchema>;
