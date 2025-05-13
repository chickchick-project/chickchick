type CollectionItem = {
  id: number;
  name: string;
};

type BookmarkItem = {
  id: number;
  name: string;
};

type MeAllData = {
  collection: CollectionItem[];
  bookmarks: {
    perfumes: BookmarkItem[];
    community: { id: number; title: string; category: string }[];
  };
  activity: {
    myReviews: { id: number; perfume: string; content: string }[];
    myPosts: { id: number; title: string; content: string }[];
    myComments: { id: number; postId: number; content: string }[];
    likedPerfumes: CollectionItem[];
    likedPosts: { id: number; title: string }[];
  };
  profile: {
    name: string;
    nickname: string;
    gender: string;
    age: number;
  };
};

export async function mockFetchAllMyPageData(): Promise<MeAllData> {
  return {
    collection: [
      { id: 1, name: "향수 A" },
      { id: 2, name: "향수 B" },
      { id: 3, name: "향수 C" },
      { id: 4, name: "향수 D" },
      { id: 5, name: "향수 E" },
      { id: 6, name: "향수 F" },
      { id: 7, name: "향수 G" },
      { id: 8, name: "향수 H" },
      { id: 9, name: "향수 I" },
      { id: 10, name: "향수 J" },
      { id: 11, name: "향수 K" },
    ],
    bookmarks: {
      perfumes: [
        { id: 3, name: "북마크 향수 1" },
        { id: 4, name: "북마크 향수 2" },
      ],
      community: [
        { id: 5, title: "향수 정보 공유", category: "자유 게시판" },
        { id: 6, title: "리뷰 모음", category: "리뷰 게시판" },
      ],
    },
    activity: {
      myReviews: [{ id: 7, perfume: "향수 A", content: "아주 좋았어요." }],
      myPosts: [{ id: 8, title: "추천 부탁", content: "상큼한 향 좋아요." }],
      myComments: [
        { id: 9, postId: 8, content: "저도 궁금해요!" },
        { id: 10, postId: 8, content: "저도 궁금해요!" },
      ],
      likedPerfumes: [{ id: 11, name: "좋아한 향수" }],
      likedPosts: [{ id: 12, title: "향수 vs 디퓨저" }],
    },
    profile: {
      name: "김하은",
      nickname: "하은",
      gender: "",
      age: 0,
    },
  };
}
