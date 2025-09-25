export interface MockCollectionItem {
  id: string | number;
  imageUrl: string;
  title: string;
}

export interface MockPerfumeBookmark {
  id: number;
  name: string;
}

export interface MockCommunityBookmark {
  id: number;
  title: string;
  category: string;
}

export interface MockPerfumeBookmarksData {
  perfumes: MockPerfumeBookmark[];
}

export interface MockCommunityBookmarksData {
  community: MockCommunityBookmark[];
}

export interface MockMyReview {
  id: number;
  perfume: string;
  content: string;
  chips: string[];
  isAuthor: boolean;
  isMyPage: boolean;
}

export interface MockMyPost {
  id: number;
  title: string;
  content: string;
  isAuthor: boolean;
}

export interface MockMyComment {
  id: number;
  postId: number;
  content: string;
}

export interface MockLikedPerfume {
  id: number;
  name: string;
}

export interface MockLikedPost {
  id: number;
  title: string;
  category: string;
}

export interface MockActivityData {
  myReviews: MockMyReview[];
  myPosts: MockMyPost[];
  myComments: MockMyComment[];
  likedPerfumes: MockLikedPerfume[];
  likedPosts: MockLikedPost[];
}

export interface MockProfileData {
  id: string;
  name: string;
  nickname: string;
  level?: number;
  avatarUrl?: string;
  gender: string;
  age: number;
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
}

export type UserPageTapData =
  | MockCollectionItem[]
  | MockPerfumeBookmarksData
  | MockActivityData
  | MockProfileData;

export interface TabData {
  tap: string;
  data: UserPageTapData | null;
  error?: string;
}

const generateMockCollection = (count: number): MockCollectionItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `col-item-${i + 1}`,
    imageUrl: `https://picsum.photos/seed/col${i}/200/300`,
    title: `컬렉션 아이템 ${i + 1}`,
  }));
};

export async function fetchMockCollectionData(
  userId: string
): Promise<MockCollectionItem[]> {
  console.log(`Fetching collection : ${userId}`);
  await new Promise((resolve) => setTimeout(resolve, 100));
  return generateMockCollection(12);
}

export async function fetchMockPerfumeBookmarksData(
  userId: string
): Promise<MockPerfumeBookmark[]> {
  console.log(`Fetching bookmarks : ${userId}`);
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    { id: 3, name: "북마크 향수 1" },
    { id: 4, name: "북마크 향수 2" },
  ];
}

export async function fetchMockCommunityBookmarks(
  userId: string
): Promise<MockCommunityBookmark[]> {
  console.log(`Fetching community bookmarks : ${userId}`);
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    { id: 5, title: "향수 정보 공유", category: "자유 게시판" },
    { id: 6, title: "리뷰 모음", category: "리뷰 게시판" },
  ];
}

export async function fetchMockActivityData(
  userId: string
): Promise<MockActivityData> {
  console.log(`Fetching activity : ${userId}`);
  await new Promise((resolve) => setTimeout(resolve, 100));
  return {
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
    likedPosts: [{ id: 12, title: "향수 vs 디퓨저", category: "자유 게시판" }],
  };
}
