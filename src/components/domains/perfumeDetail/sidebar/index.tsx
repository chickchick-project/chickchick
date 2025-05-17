import React from "react";
import { PostCard } from "@/components/commons/card/postCard";
import { CATEGORY_TYPES, POST_CARD_TYPES } from "@/lib/constants/post";

export const PerfumeDetailSidebar = () => {
  const mockPosts = [
    {
      id: "1",
      title: "봄에 어울리는 향수 추천",
      content: "화사한 봄 향기를 담은 향수로 기분전환해보세요!",
      author: "은지",
      createdAt: "2024.04.03",
      meta: [
        { type: "Like" as const, count: 999 },
        { type: "Comment" as const, count: 1200 },
        { type: "View" as const, count: 1200 },
      ],
      categoryType: CATEGORY_TYPES.FREEBOARD,
      profileImage: "https://i.ibb.co/TR0HqY4/image.jpg",
      isAuthor: false,
    },
    {
      id: "2",
      title: "남자친구 선물로 딱",
      content: "남자친구가 진짜 좋아했어요. 잔향도 오래 남아요.",
      author: "지훈",
      createdAt: "2024.02.17",
      meta: [
        { type: "Like" as const, count: 999 },
        { type: "Comment" as const, count: 1200 },
        { type: "View" as const, count: 1200 },
      ],
      categoryType: CATEGORY_TYPES.RECOMMENDATION,
      profileImage: "https://i.ibb.co/TR0HqY4/image.jpg",
      isAuthor: false,
    },
    {
      id: "3",
      title: "이 향수, 데일리로 괜찮을까?",
      content:
        "출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄 출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄 출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄 출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄",
      author: "수진",
      createdAt: "2024.03.12",
      meta: [
        { type: "Like" as const, count: 999 },
        { type: "Comment" as const, count: 1200 },
        { type: "View" as const, count: 1200 },
      ],
      categoryType: CATEGORY_TYPES.RECOMMENDATION,
      profileImage: "https://i.ibb.co/TR0HqY4/image.jpg",
      isAuthor: false,
    },
    {
      id: "4",
      title: "지속력 실화냐",
      content: "아침에 뿌리고 저녁까지 향 남아있어요. 대박",
      author: "다현",
      createdAt: "2024.01.05",
      meta: [
        { type: "Like" as const, count: 999 },
        { type: "Comment" as const, count: 1200 },
        { type: "View" as const, count: 1200 },
      ],
      categoryType: CATEGORY_TYPES.RECOMMENDATION,
      profileImage: "https://i.ibb.co/TR0HqY4/image.jpg",
      isAuthor: false,
    },
    {
      id: "5",
      title: "패키지 디자인이 예쁨",
      content: "보자마자 반했어요. 책상 위에 올려두면 인테리어처럼 예뻐요.",
      author: "현우",
      createdAt: "2024.05.01",
      meta: [
        { type: "Like" as const, count: 999 },
        { type: "Comment" as const, count: 1200 },
        { type: "View" as const, count: 1200 },
      ],
      categoryType: CATEGORY_TYPES.RECOMMENDATION,
      profileImage: "https://i.ibb.co/TR0HqY4/image.jpg",
      isAuthor: false,
    },
  ];

  return (
    <section className="pl-5 pc:pl-0">
      <h2 className="font-semibold text-black-100 text-title-2 pb-4 tablet:text-headline-2 tablet:pb-5">
        이 향수, 커뮤니티에서는?
      </h2>
      <ul className="flex gap-4 overflow-x-auto pc:flex-col pc:gap-6 scrollbar-hide pr-5 pc:pr-0">
        {mockPosts.map((post) => (
          <li key={post.id}>
            <PostCard {...post} cardType={POST_CARD_TYPES.DETAIL} />
          </li>
        ))}
      </ul>
    </section>
  );
};
