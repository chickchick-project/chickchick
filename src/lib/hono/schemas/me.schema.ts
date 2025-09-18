import { z } from "zod";
import { PostResponseSchema } from "./community.schema";
import { PerfumeBaseResponseSchema } from "./perfume.schema";
import { UserCollectionSchema } from "@zod/modelSchema/UserCollectionSchema";
import { CollectionImageSchema } from "@zod/modelSchema/CollectionImageSchema";

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

export type MyBookmarkedPostsResponse = z.infer<
  typeof MyBookmarkedPostsResponseSchema
>;
export type MyBookmarkedPerfumesResponse = z.infer<
  typeof MyBookmarkedPerfumesResponseSchema
>;

export type MyPhotoCollectionResponse = z.infer<
  typeof MyPhotoCollectionResponseSchema
>;
