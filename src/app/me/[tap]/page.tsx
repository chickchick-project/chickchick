import MeFooter from "@/components/domains/me/Footer";
import MeHeader from "@/components/domains/me/Header";
import PageClient from "@/components/domains/me/PageClient";

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

export type TabData =
  | { tap: "collection"; data: CollectionItem[] }
  | {
      tap: "bookmarks";
      data: {
        perfumes: BookmarkItem[];
        community: { id: number; title: string; category: string }[];
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

async function mockFetchAllMyPageData(): Promise<MeAllData> {
  return {
    collection: [
      { id: 1, name: "향수 A" },
      { id: 2, name: "향수 B" },
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
      myComments: [{ id: 9, postId: 8, content: "저도 궁금해요!" }],
      likedPerfumes: [{ id: 10, name: "좋아한 향수" }],
      likedPosts: [{ id: 11, title: "향수 vs 디퓨저" }],
    },
    profile: {
      name: "김하은",
      nickname: "하은",
      gender: "",
      age: 0,
    },
  };
}

export default async function MePage({
  params,
}: {
  params: Promise<{ tap: string }>;
}) {
  const { tap } = await params;

  const allData = await mockFetchAllMyPageData();

  let tabData: TabData;

  if (tap === "collection") {
    tabData = { tap, data: allData.collection };
  } else if (tap === "bookmarks") {
    tabData = { tap, data: allData.bookmarks };
  } else if (tap === "activity") {
    tabData = { tap, data: allData.activity };
  } else {
    tabData = { tap: "profile", data: allData.profile };
  }

  return (
    <>
      <MeHeader />
      <PageClient {...tabData} />
      {tap !== "profile" && <MeFooter />}
    </>
  );
}
