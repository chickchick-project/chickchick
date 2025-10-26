import React from "react";
import { PostCard } from "@/components/commons/card/postCard";
import { CATEGORY_TYPES, POST_CARD_TYPES } from "@/lib/constants/post";
import { SectionTitle } from "@/components/commons/sectionTitle";
import { ApiPostResponse } from "@/lib/hono/schemas/community.schema";

export const PerfumeDetailSidebar = () => {
  const mockPosts: ApiPostResponse[] = [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      title: "봄에 어울리는 향수 추천",
      content: "<p>화사한 봄 향기를 담은 향수로 기분전환해보세요!</p>",
      contentText: "화사한 봄 향기를 담은 향수로 기분전환해보세요!",
      category: CATEGORY_TYPES.FREEBOARD,
      published: true,
      viewCount: 1200,
      likeCount: 999,
      commentCount: 1200,
      thumbnailUrl: null,
      author: {
        id: "550e8400-e29b-41d4-a716-446655440011",
        nickname: "은지",
        imageUrl: "https://i.ibb.co/TR0HqY4/image.jpg",
      },
      createdAt: "2024-04-03T00:00:00.000Z",
      updatedAt: null,
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      title: "남자친구 선물로 딱",
      content: "<p>남자친구가 진짜 좋아했어요. 잔향도 오래 남아요.</p>",
      contentText: "남자친구가 진짜 좋아했어요. 잔향도 오래 남아요.",
      category: CATEGORY_TYPES.RECOMMENDATION,
      published: true,
      viewCount: 1200,
      likeCount: 999,
      commentCount: 1200,
      thumbnailUrl: null,
      author: {
        id: "550e8400-e29b-41d4-a716-446655440012",
        nickname: "지훈",
        imageUrl: "https://i.ibb.co/TR0HqY4/image.jpg",
      },
      createdAt: "2024-02-17T00:00:00.000Z",
      updatedAt: null,
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      title: "이 향수, 데일리로 괜찮을까?",
      content:
        "<p>출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄 출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄 출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄 출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄</p>",
      contentText:
        "출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄 출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄 출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄 출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄",
      category: CATEGORY_TYPES.RECOMMENDATION,
      published: true,
      viewCount: 1200,
      likeCount: 999,
      commentCount: 1200,
      thumbnailUrl: null,
      author: {
        id: "550e8400-e29b-41d4-a716-446655440013",
        nickname: "수진",
        imageUrl: "https://i.ibb.co/TR0HqY4/image.jpg",
      },
      createdAt: "2024-03-12T00:00:00.000Z",
      updatedAt: null,
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440004",
      title: "지속력 실화냐",
      content: "<p>아침에 뿌리고 저녁까지 향 남아있어요. 대박</p>",
      contentText: "아침에 뿌리고 저녁까지 향 남아있어요. 대박",
      category: CATEGORY_TYPES.RECOMMENDATION,
      published: true,
      viewCount: 1200,
      likeCount: 999,
      commentCount: 1200,
      thumbnailUrl: null,
      author: {
        id: "550e8400-e29b-41d4-a716-446655440014",
        nickname: "다현",
        imageUrl: "https://i.ibb.co/TR0HqY4/image.jpg",
      },
      createdAt: "2024-01-05T00:00:00.000Z",
      updatedAt: null,
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440005",
      title: "패키지 디자인이 예쁨",
      content:
        "<p>보자마자 반했어요. 책상 위에 올려두면 인테리어처럼 예뻐요.</p>",
      contentText: "보자마자 반했어요. 책상 위에 올려두면 인테리어처럼 예뻐요.",
      category: CATEGORY_TYPES.RECOMMENDATION,
      published: true,
      viewCount: 1200,
      likeCount: 999,
      commentCount: 1200,
      thumbnailUrl: null,
      author: {
        id: "550e8400-e29b-41d4-a716-446655440015",
        nickname: "현우",
        imageUrl: "https://i.ibb.co/TR0HqY4/image.jpg",
      },
      createdAt: "2024-05-01T00:00:00.000Z",
      updatedAt: null,
    },
  ];

  return (
    <section>
      <SectionTitle>이 향수, 커뮤니티에서는?</SectionTitle>
      <ul className="pl-5 pc:pl-0 flex gap-4 pb-5 overflow-x-auto pc:overflow-x-visible pc:flex-col pc:gap-6 scrollbar-hide pr-5 pc:pr-0 pt-4 tablet:pt-5">
        {mockPosts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} cardType={POST_CARD_TYPES.DETAIL} />
          </li>
        ))}
      </ul>
    </section>
  );
};
