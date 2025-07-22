import { z } from "zod";
import { PostResponseSchema } from "./community.schema";
import { PerfumeBaseResponseSchema } from "./perfume.schema";

export const MyBookmarkedPostsResponseSchema = z.array(PostResponseSchema);

export const MyBookmarkedPerfumesResponseSchema = z.array(
  PerfumeBaseResponseSchema
);

export type MyBookmarkedPostsResponse = z.infer<
  typeof MyBookmarkedPostsResponseSchema
>;
export type MyBookmarkedPerfumesResponse = z.infer<
  typeof MyBookmarkedPerfumesResponseSchema
>;
