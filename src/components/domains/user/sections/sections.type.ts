import { CommentResponse } from "@/lib/hono/schemas/comment.schema";
import { ApiPostResponse } from "@/lib/hono/schemas/community.schema";
import { ApiReviewResponse } from "@/lib/hono/schemas/review.schema";
import { User, UserCollection, CollectionImage, Perfume } from "@prisma/client";
import { PerfumeBookmark } from "@zod/modelSchema/PerfumeBookmarkSchema";

export type CollectionItem = UserCollection & {
  image?: CollectionImage;
  perfume?: Perfume;
};

export type BookmarkData = {
  perfumes: PerfumeBookmark[];
  community: ApiPostResponse[];
};

export type ActivityData = {
  myReviews: ApiReviewResponse[];
  myPosts: ApiPostResponse[];
  myComments: CommentResponse[];
  likedPerfumes: PerfumeBookmark[];
  likedPosts: ApiPostResponse[];
};

export type TabData =
  | { tap: "collection"; data: CollectionItem[] }
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
      data: User;
    };
