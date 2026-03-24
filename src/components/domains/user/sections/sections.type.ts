import type { CommentResponse } from "@/server/hono/schemas/comment.schema";
import type { ApiPostResponse } from "@/server/hono/schemas/community.schema";
import type { ApiReviewResponse } from "@/server/hono/schemas/review.schema";
import {
  ApiMyCollectionResponse,
  ApiMyProfileResponse,
  ApiMyBookmarkedPerfumesResponse,
} from "@/server/hono/schemas/me.schema";

export type BookmarkData = {
  perfumes: ApiMyBookmarkedPerfumesResponse[];
  community: ApiPostResponse[];
};

export type ActivityData = {
  myReviews: ApiReviewResponse[];
  myPosts: ApiPostResponse[];
  myComments: CommentResponse[];
  likedPerfumes: ApiMyBookmarkedPerfumesResponse[];
  likedPosts: ApiPostResponse[];
};

export type TabData =
  | { tap: "collection"; data: ApiMyCollectionResponse[] }
  | {
      tap: "bookmarks";
      data: BookmarkData;
    }
  | {
      tap: "activity";
      data: ActivityData;
    }
  | {
      tap: "profile";
      data: ApiMyProfileResponse;
    };
