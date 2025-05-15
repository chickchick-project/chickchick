import {
  CollectionItem,
  BookmarkData,
} from "@/components/domains/user/sections/sections.type";

type MeAllData = {
  collection: CollectionItem[];
  bookmarks: BookmarkData;
  activity: {
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
    likedPerfumes: CollectionItem[];
    likedPosts: { id: number; title: string; category: string }[];
  };
  profile: {
    name: string;
    nickname: string;
    gender: string;
    age: number;
  };
};

function generateMockCollection(count: number): CollectionItem[] {
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    return {
      id,
      name: `향수 ${String.fromCharCode(65 + (i % 26))}`,
      imageUrl: `https://picsum.photos/seed/collection-${id}/300`,
    };
  });
}

export async function mockFetchAllMyPageData(): Promise<MeAllData> {
  return {
    collection: generateMockCollection(12),
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
      myReviews: [
        {
          id: 7,
          perfume: "향수 A",
          content: "아주 좋았어요.",
          chips: ["기본 칩"],
          isAuthor: true,
          isMyPage: true,
        },
      ],
      myPosts: [
        {
          id: 8,
          title: "추천 부탁",
          content: "상큼한 향 좋아요.",
          isAuthor: true,
        },
      ],
      myComments: [
        { id: 9, postId: 8, content: "저도 궁금해요!" },
        { id: 10, postId: 8, content: "저도 궁금해요!" },
      ],
      likedPerfumes: [{ id: 11, name: "좋아한 향수" }],
      likedPosts: [
        { id: 12, title: "향수 vs 디퓨저", category: "자유 게시판" },
      ],
    },
    profile: {
      name: "김하은",
      nickname: "하은",
      gender: "",
      age: 0,
    },
  };
}
