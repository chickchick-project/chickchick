import { CommentResponse } from "@/lib/hono/schemas/comment.schema";
import { PostResponse } from "@/lib/hono/schemas/community.schema";
import { ReviewResponse } from "@/lib/hono/schemas/review.schema";
import { User, UserCollection, CollectionImage, Perfume } from "@prisma/client";
import { PerfumeBookmark } from "@zod/modelSchema/PerfumeBookmarkSchema";

export type CollectionItem = UserCollection & {
  image?: CollectionImage;
  perfume?: Perfume;
};

export type BookmarkData = {
  perfumes: PerfumeBookmark[];
  community: PostResponse[];
};

export type ActivityData = {
  myReviews: ReviewResponse[];
  myPosts: PostResponse[];
  myComments: CommentResponse[];
  likedPerfumes: PerfumeBookmark[];
  likedPosts: PostResponse[];
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
