export type CollectionItem = {
  id: number;
  name: string;
  imageHeight?: number;
};

type PerfumeBookmark = {
  id: number;
  name: string;
};

type CommunityBookmark = {
  id: number;
  title: string;
  category: string;
};

export type TabData =
  | { tap: "collection"; data: CollectionItem[] }
  | {
      tap: "bookmarks";
      data: {
        perfumes: PerfumeBookmark[];
        community: CommunityBookmark[];
      };
    }
  | {
      tap: "activity";
      data: {
        myReviews: { id: number; perfume: string; content: string }[];
        myPosts: { id: number; title: string; content: string }[];
        myComments: { id: number; postId: number; content: string }[];
        likedPerfumes: CollectionItem[];
        likedPosts: { id: number; title: string }[];
      };
    }
  | {
      tap: "profile";
      data: {
        name: string;
        nickname: string;
        gender: string;
        age: number;
      };
    };

export type BookmarkData = {
  perfumes: PerfumeBookmark[];
  community: CommunityBookmark[];
};

export type ActivityData = {
  myReviews: { id: number; perfume: string; content: string }[];
  myPosts: { id: number; title: string; content: string }[];
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
