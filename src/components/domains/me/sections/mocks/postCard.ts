export const MOCK_POST_CARD: {
  categoryType: "question" | "discussion" | "recommendation";
  title: string;
  content: string;
  author: string;
  createdAt: string;
  profileImage: string;
  thumbnail: string;
  cardType: "default" | "small" | "detail";
  isCategory: boolean;
  isAuthor: boolean;
  meta: {
    type: "Like" | "Comment" | "View";
    count: number;
  }[];
} = {
  categoryType: "question",
  title: "테스트 제목",
  content: "여기는 테스트 컨텐츠입니다.",
  author: "테스터",
  createdAt: new Date().toISOString(),
  profileImage: "https://picsum.photos/28",
  thumbnail: "https://picsum.photos/100",
  cardType: "small",
  isCategory: false,
  isAuthor: false,
  meta: [
    { type: "Like", count: 999 },
    { type: "Comment", count: 1200 },
    { type: "View", count: 1200 },
  ] as {
    type: "Like" | "Comment" | "View";
    count: number;
  }[],
};
