export type PerfumeBookmark = {
  id: number;
  name: string;
};

export type CommunityBookmark = {
  id: number;
  title: string;
  category: string;
};

export type CollectionItem = {
  id: number;
  name: string;
  imageHeight?: number;
};

export type BookmarkData = {
  perfumes: PerfumeBookmark[];
  community: CommunityBookmark[];
};

export type ActivityData = {
  myReviews: {
    id: number;
    perfume: string;
    content: string;
    chips: string[];
    isAuthor: boolean;
    isMyPage: boolean;
  }[];
  myPosts: {
    id: number;
    title: string;
    content: string;
    isAuthor: boolean;
  }[];
  myComments: { id: number; postId: number; content: string }[];
  likedPerfumes: PerfumeBookmark[];
  likedPosts: CommunityBookmark[];
};

export type ProfileItem = {
  name: string;
  nickname: string;
  gender: string;
  age: number;
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
      data: ProfileItem;
    };
