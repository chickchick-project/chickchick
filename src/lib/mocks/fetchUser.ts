// import { ActivityData } from "@/components/domains/user/sections/sections.type";
// import { ApiReviewResponse } from "../hono/schemas/review.schema";
// import { ApiPostResponse } from "../hono/schemas/community.schema";
// import { CommentResponse } from "../hono/schemas/comment.schema";
// import { PerfumeBookmark } from "@zod/modelSchema/PerfumeBookmarkSchema";

// export interface MockCollectionItem {
//   id: string | number;
//   imageUrl: string;
//   title: string;
// }

// export interface MockPerfumeBookmark {
//   id: number;
//   name: string;
// }

// export interface MockCommunityBookmark {
//   id: number;
//   title: string;
//   category: string;
// }

// export interface MockPerfumeBookmarksData {
//   perfumes: MockPerfumeBookmark[];
// }

// export interface MockCommunityBookmarksData {
//   community: MockCommunityBookmark[];
// }

// export interface MockMyReview {
//   id: number;
//   perfume: string;
//   content: string;
//   chips: string[];
//   isAuthor: boolean;
//   isMyPage: boolean;
// }

// export interface MockMyPost {
//   id: number;
//   title: string;
//   content: string;
//   isAuthor: boolean;
// }

// export interface MockMyComment {
//   id: number;
//   postId: number;
//   content: string;
// }

// export interface MockLikedPerfume {
//   id: number;
//   name: string;
// }

// export interface MockLikedPost {
//   id: number;
//   title: string;
//   category: string;
// }

// export interface MockActivityData {
//   mockReviews: ApiReviewResponse[];
//   mockPosts: ApiPostResponse[];
//   mockComments: CommentResponse[];
//   likedPerfumes: PerfumeBookmark[];
//   likedPosts: ApiPostResponse[];
// }

// export interface MockProfileData {
//   id: string;
//   name: string;
//   nickname: string;
//   level?: number;
//   avatarUrl?: string;
//   gender: string;
//   age: number;
//   postCount?: number;
//   followerCount?: number;
//   followingCount?: number;
// }

// export type UserPageTapData =
//   | MockCollectionItem[]
//   | MockPerfumeBookmarksData
//   | ActivityData
//   | MockProfileData;

// export interface TabData {
//   tap: string;
//   data: UserPageTapData | null;
//   error?: string;
// }

// const generateMockCollection = (count: number): MockCollectionItem[] => {
//   return Array.from({ length: count }, (_, i) => ({
//     id: `col-item-${i + 1}`,
//     imageUrl: `https://picsum.photos/seed/col${i}/200/300`,
//     title: `컬렉션 아이템 ${i + 1}`,
//   }));
// };

// export async function fetchMockCollectionData(
//   userId: string
// ): Promise<MockCollectionItem[]> {
//   console.log(`Fetching collection : ${userId}`);
//   await new Promise((resolve) => setTimeout(resolve, 100));
//   return generateMockCollection(12);
// }

// export async function fetchMockPerfumeBookmarksData(
//   userId: string
// ): Promise<MockPerfumeBookmark[]> {
//   console.log(`Fetching bookmarks : ${userId}`);
//   await new Promise((resolve) => setTimeout(resolve, 100));
//   return [
//     { id: 3, name: "북마크 향수 1" },
//     { id: 4, name: "북마크 향수 2" },
//   ];
// }

// export async function fetchMockCommunityBookmarks(
//   userId: string
// ): Promise<MockCommunityBookmark[]> {
//   console.log(`Fetching community bookmarks : ${userId}`);
//   await new Promise((resolve) => setTimeout(resolve, 100));
//   return [
//     { id: 5, title: "향수 정보 공유", category: "자유 게시판" },
//     { id: 6, title: "리뷰 모음", category: "리뷰 게시판" },
//   ];
// }

// export async function fetchMockActivityData(
//   userId: string
// ): Promise<MockActivityData> {
//   console.log(`Fetching activity : ${userId}`);
//   await new Promise((resolve) => setTimeout(resolve, 100));

//   return {
//     // 리뷰 목데이터
//     mockReviews: [
//       {
//         id: "review-1",
//         usageStatus: "CURRENTLY_USING",
//         content: "정말 좋은 향수입니다. 지속력도 좋고 향도 마음에 들어요.",
//         createdAt: new Date("2024-01-15T10:30:00.000Z"),
//         author: {
//           id: "user-1",
//           nickname: "향수러버",
//           imageUrl: "https://example.com/avatar1.jpg",
//         },
//         chips: {
//           feeling: "GOOD",
//           longevity: "LONG_LASTING",
//           sillage: "MODERATE",
//           genderTone: "UNISEX",
//           season: ["SPRING", "SUMMER"],
//           timeOfDay: "DAY",
//           pricePerception: "REASONABLE",
//         },
//       },
//       {
//         id: "review-2",
//         usageStatus: "USED_BEFORE",
//         content:
//           "샘플로 써봤는데 생각보다 괜찮네요. 다음에 정품 구매 고려중입니다.",
//         createdAt: new Date("2024-01-20T15:45:00.000Z"),
//         author: {
//           id: "user-2",
//           nickname: "센트마니아",
//           imageUrl: "https://example.com/avatar2.jpg",
//         },
//         chips: {
//           feeling: "BEST",
//           longevity: "LONG_LASTING",
//           sillage: "STRONG",
//           genderTone: "FEMININE",
//           season: ["AUTUMN"],
//           timeOfDay: "NIGHT",
//           pricePerception: "EXPENSIVE",
//         },
//       },
//     ],

//     // 게시글 목데이터
//     mockPosts: [
//       {
//         id: "post-1",
//         title: "봄에 어울리는 향수 추천해주세요",
//         content:
//           "날씨가 따뜻해지면서 가벼운 향수를 찾고 있어요. 플로럴이나 시트러스 계열로 추천 부탁드립니다.",
//         contentText:
//           "날씨가 따뜻해지면서 가벼운 향수를 찾고 있어요. 플로럴이나 시트러스 계열로 추천 부탁드립니다.",
//         category: "RECOMMENDATION",
//         viewCount: 127,
//         likeCount: 15,
//         commentCount: 8,
//         thumbnailUrl: "https://example.com/post1-thumb.jpg",
//         createdAt: "2024-01-18T09:15:00.000Z",
//         updatedAt: null,
//         author: {
//           id: "user-1",
//           nickname: "향수러버",
//           imageUrl: "https://example.com/avatar1.jpg",
//         },
//       },
//       {
//         id: "post-2",
//         title: "향수 지속력 늘리는 팁 공유",
//         content:
//           "향수를 오래 지속시키는 방법들을 정리해봤어요. 도움이 되었으면 좋겠습니다.",
//         contentText:
//           "향수를 오래 지속시키는 방법들을 정리해봤어요. 도움이 되었으면 좋겠습니다.",
//         category: "FREEBOARD",
//         viewCount: 89,
//         likeCount: 22,
//         commentCount: 12,
//         thumbnailUrl: null,
//         createdAt: "2024-01-22T14:20:00.000Z",
//         updatedAt: "2024-01-22T14:25:00.000Z",
//         author: {
//           id: "user-2",
//           nickname: "센트마니아",
//           imageUrl: "https://example.com/avatar2.jpg",
//         },
//       },
//     ],

//     // 댓글 목데이터
//     mockComments: [
//       {
//         id: "comment-1",
//         content: "저도 같은 고민이었는데 정말 유용한 정보네요. 감사합니다!",
//         parentId: null,
//         postId: "post-2",
//         published: true,
//         createdAt: "2024-01-22T16:30:00.000Z",
//         updatedAt: "2024-01-22T16:30:00.000Z",
//         author: {
//           id: "user-3",
//           nickname: "뷰티덕후",
//           imageUrl: "https://example.com/avatar3.jpg",
//         },
//         replies: [
//           {
//             id: "reply-1",
//             content: "도움이 되었다니 기쁘네요!",
//             parentId: "comment-1",
//             postId: "post-2",
//             published: true,
//             createdAt: "2024-01-22T17:00:00.000Z",
//             updatedAt: "2024-01-22T17:00:00.000Z",
//             author: {
//               id: "user-2",
//               nickname: "센트마니아",
//               imageUrl: "https://example.com/avatar2.jpg",
//             },
//           },
//         ],
//       },
//       {
//         id: "comment-2",
//         content: "봄향수로는 조말론 피오니 앤 블러시 스웨이드 추천드려요!",
//         parentId: null,
//         postId: "post-1",
//         published: true,
//         createdAt: "2024-01-18T11:45:00.000Z",
//         updatedAt: "2024-01-18T11:45:00.000Z",
//         author: {
//           id: "user-4",
//           nickname: "향수컬렉터",
//           imageUrl: "https://example.com/avatar4.jpg",
//         },
//         replies: [],
//       },
//     ],

//     // 향수 북마크 목데이터
//     likedPerfumes: [
//       {
//         id: "bookmark-1",
//         userId: "user-1",
//         perfumeId: "perfume-1",
//         createdAt: new Date("2024-01-10T08:00:00.000Z"),
//         isPublic: true,
//       },
//       {
//         id: "bookmark-2",
//         userId: "user-1",
//         perfumeId: "perfume-2",
//         createdAt: new Date("2024-01-16T12:30:00.000Z"),
//         isPublic: false,
//       },
//     ],

//     // 좋아요한 게시글 목데이터
//     likedPosts: [
//       {
//         id: "liked-post-1",
//         title: "향수 입문자를 위한 가이드",
//         content: "향수를 처음 시작하는 분들을 위한 기본 정보들을 모아봤습니다.",
//         contentText:
//           "향수를 처음 시작하는 분들을 위한 기본 정보들을 모아봤습니다.",
//         category: "QUESTION",
//         viewCount: 203,
//         likeCount: 45,
//         commentCount: 18,
//         thumbnailUrl: "https://example.com/guide-thumb.jpg",
//         createdAt: "2024-01-12T13:20:00.000Z",
//         updatedAt: null,
//         author: {
//           id: "user-5",
//           nickname: "향수전문가",
//           imageUrl: "https://example.com/avatar5.jpg",
//         },
//       },
//       {
//         id: "liked-post-2",
//         title: "겨울철 추천 향수 베스트 5",
//         content:
//           "추운 겨울에 어울리는 따뜻하고 포근한 향수들을 추천해드립니다.",
//         contentText:
//           "추운 겨울에 어울리는 따뜻하고 포근한 향수들을 추천해드립니다.",
//         category: "RECOMMENDATION",
//         viewCount: 156,
//         likeCount: 31,
//         commentCount: 9,
//         thumbnailUrl: null,
//         createdAt: "2024-01-08T19:45:00.000Z",
//         updatedAt: "2024-01-09T10:15:00.000Z",
//         author: {
//           id: "user-6",
//           nickname: "윈터센트",
//           imageUrl: "https://example.com/avatar6.jpg",
//         },
//       },
//     ],
//   };
// }
