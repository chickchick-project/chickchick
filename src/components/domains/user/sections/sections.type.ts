import { CommentResponse } from "@/lib/hono/schemas/comment.schema";
import { ApiPostResponse } from "@/lib/hono/schemas/community.schema";
import { ApiReviewResponse } from "@/lib/hono/schemas/review.schema";
import {
  ApiMyCollectionResponse,
  ApiMyProfileResponse,
  ApiMyBookmarkedPerfumesResponse,
} from "@/lib/hono/schemas/me.schema";

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
