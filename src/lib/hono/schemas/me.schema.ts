import { z } from "zod";
import { PostResponseSchema } from "./community.schema";
import { PerfumeBaseResponseSchema } from "./perfume.schema";
import { ReviewResponseSchema } from "./review.schema";
import { CommentResponseSchema } from "./comment.schema";
import { UserCollectionSchema } from "@zod/modelSchema/UserCollectionSchema";
import { CollectionImageSchema } from "@zod/modelSchema/CollectionImageSchema";
import { PerfumeBookmarkSchema } from "@zod/modelSchema/PerfumeBookmarkSchema";

export const MyBookmarkedPostsResponseSchema = z.array(PostResponseSchema);

export const MyBookmarkedPerfumesResponseSchema = z.array(
  PerfumeBaseResponseSchema
);

export const CreatePhotoCollectionRequestSchema = z.object({
  perfumeId: z.string().uuid(),
  comment: z.string().optional(),
});

export const MyPhotoCollectionResponseSchema = UserCollectionSchema.pick({
  id: true,
  userId: true,
  perfumeId: true,
  comment: true,
  createdAt: true,
}).extend({
  image: CollectionImageSchema.pick({ id: true, imageUrl: true }).optional(),
});

export const MyReviewsResponseSchema = z.array(ReviewResponseSchema);
export const MyPostsResponseSchema = z.array(PostResponseSchema);
export const MyCommentsResponseSchema = z.array(CommentResponseSchema);
export const MyLikedPerfumesResponseSchema = z.array(PerfumeBookmarkSchema);
export const MyLikedPostsResponseSchema = z.array(PostResponseSchema);

export const DeleteCollectionParamSchema = z.object({
  collectionId: z.string().uuid(),
});

export type MyBookmarkedPostsResponse = z.infer<
  typeof MyBookmarkedPostsResponseSchema
>;
export type MyBookmarkedPerfumesResponse = z.infer<
  typeof MyBookmarkedPerfumesResponseSchema
>;

export type MyPhotoCollectionResponse = z.infer<
  typeof MyPhotoCollectionResponseSchema
>;

export type MyReviewsResponse = z.infer<typeof MyReviewsResponseSchema>;
export type MyPostsResponse = z.infer<typeof MyPostsResponseSchema>;
export type MyCommentsResponse = z.infer<typeof MyCommentsResponseSchema>;
export type MyLikedPerfumesResponse = z.infer<
  typeof MyLikedPerfumesResponseSchema
>;
export type MyLikedPostsResponse = z.infer<typeof MyLikedPostsResponseSchema>;
export type DeleteCollectionParam = z.infer<typeof DeleteCollectionParamSchema>;
