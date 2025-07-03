import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";

export const mockPostCardData: PostCardProps = {
  id: "1",
  title: "봄에 어울리는 향수 추천",
  content: "따뜻한 봄날에 잘 어울리는 플로럴 계열 향수를 추천해요.",
  author: "향기로운나",
  createdAt: "2025-04-25 09:12:00",
  categoryType: "RECOMMENDATION",
  meta: [
    { type: "Like", count: 12 },
    { type: "Comment", count: 3 },
    { type: "View", count: 157 },
  ],
  isAuthor: false,
};
