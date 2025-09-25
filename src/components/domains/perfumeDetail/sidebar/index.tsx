import React from "react";
import { PostCard } from "@/components/commons/card/postCard";
import { CATEGORY_TYPES, POST_CARD_TYPES } from "@/lib/constants/post";
import { SectionTitle } from "@/components/commons/sectionTitle";

export const PerfumeDetailSidebar = () => {
  const mockPosts = [
    {
      post: {
        id: "1",
        title: "봄에 어울리는 향수 추천",
        content: "화사한 봄 향기를 담은 향수로 기분전환해보세요!",
        userId: "",
        createdAt: "2024.04.03",
        updatedAt: null,
        likeCount: 999, // meta 배열 대신 직접 값으로
        commentCount: 1200,
        viewCount: 1200,
        category: CATEGORY_TYPES.FREEBOARD,
        thumbnailUrl: "https://i.ibb.co/TR0HqY4/image.jpg",
        published: true,
        contentText: "화사한 봄 향기를 담은 향수로 기분전환해보세요!",
      },
      author: {
        id: "1",
        nickname: "은지",
        imageUrl: "",
      },
      createdAt: "2024.04.03",
      isAuthor: false,
      cardType: "small",
    },
    {
      post: {
        id: "2",
        title: "남자친구 선물로 딱",
        content: "남자친구가 진짜 좋아했어요. 잔향도 오래 남아요.",
        userId: "",
        createdAt: "2024.02.17",
        updatedAt: null,
        likeCount: 999,
        commentCount: 1200,
        viewCount: 1200,
        category: CATEGORY_TYPES.RECOMMENDATION,
        thumbnailUrl: "https://i.ibb.co/TR0HqY4/image.jpg",
        published: true,
        contentText: "남자친구가 진짜 좋아했어요. 잔향도 오래 남아요.",
      },
      author: {
        id: "2",
        nickname: "은지",
        imageUrl: "",
      },
      createdAt: "2024.02.17",
      isAuthor: false,
      cardType: "small",
    },
    {
      post: {
        id: "3",
        title: "남자친구 선물로 딱",
        content: "남자친구가 진짜 좋아했어요. 잔향도 오래 남아요.",
        userId: "",
        createdAt: "2024.02.17",
        updatedAt: null,
        likeCount: 999,
        commentCount: 1200,
        viewCount: 1200,
        category: CATEGORY_TYPES.RECOMMENDATION,
        thumbnailUrl: "https://i.ibb.co/TR0HqY4/image.jpg",
        published: true,
        contentText: "남자친구가 진짜 좋아했어요. 잔향도 오래 남아요.",
      },
      author: {
        id: "2",
        nickname: "은지",
        imageUrl: "",
      },
      createdAt: "2024.02.17",
      isAuthor: false,
      cardType: "small",
    },
    {
      post: {
        id: "3",
        title: "이 향수, 데일리로 괜찮을까?",
        content:
          "출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄...",
        userId: "",
        createdAt: "2024.03.12",
        updatedAt: null,
        likeCount: 999,
        commentCount: 1200,
        viewCount: 1200,
        category: CATEGORY_TYPES.RECOMMENDATION,
        thumbnailUrl: "https://i.ibb.co/TR0HqY4/image.jpg",
        published: true,
        contentText:
          "출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄...",
      },
      author: {
        id: "3",
        nickname: "은지",
        imageUrl: "",
      },
      createdAt: "2024.03.12",
      isAuthor: false,
      cardType: "small",
    },
    {
      post: {
        id: "4",
        title: "이 향수, 데일리로 괜찮을까?",
        content:
          "출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄...",
        userId: "",
        createdAt: "2024.03.12",
        updatedAt: null,
        likeCount: 999,
        commentCount: 1200,
        viewCount: 1200,
        category: CATEGORY_TYPES.RECOMMENDATION,
        thumbnailUrl: "https://i.ibb.co/TR0HqY4/image.jpg",
        published: true,
        contentText:
          "출근용 향수 찾고 있었는데 데일리로 좋다는 리뷰 많아서 써봄...",
      },
      author: {
        id: "4",
        nickname: "은지",
        imageUrl: "",
      },
      createdAt: "2024.01.05",
      isAuthor: false,
      cardType: "small",
    },
    {
      post: {
        id: "4",
        title: "지속력 실화냐",
        content: "아침에 뿌리고 저녁까지 향 남아있어요. 대박",
        userId: "",
        createdAt: "2024.01.05",
        updatedAt: null,
        likeCount: 999,
        commentCount: 1200,
        viewCount: 1200,
        category: CATEGORY_TYPES.RECOMMENDATION,
        thumbnailUrl: "https://i.ibb.co/TR0HqY4/image.jpg",
        published: true,
        contentText: "아침에 뿌리고 저녁까지 향 남아있어요. 대박",
      },
      author: {
        id: "4",
        nickname: "은지",
        imageUrl: "",
      },
      createdAt: "2024.01.05",
      isAuthor: false,
      cardType: "small",
    },
    {
      post: {
        id: "4",
        title: "지속력 실화냐",
        content: "아침에 뿌리고 저녁까지 향 남아있어요. 대박",
        userId: "",
        createdAt: "2024.01.05",
        updatedAt: null,
        likeCount: 999,
        commentCount: 1200,
        viewCount: 1200,
        category: CATEGORY_TYPES.RECOMMENDATION,
        thumbnailUrl: "https://i.ibb.co/TR0HqY4/image.jpg",
        published: true,
        contentText: "아침에 뿌리고 저녁까지 향 남아있어요. 대박",
      },
      author: {
        id: "4",
        nickname: "은지",
        imageUrl: "",
      },
      createdAt: "2024.01.05",
      isAuthor: false,
      cardType: "small",
    },
    {
      post: {
        id: "5",
        title: "패키지 디자인이 예쁨",
        content: "보자마자 반했어요. 책상 위에 올려두면 인테리어처럼 예뻐요.",
        userId: "",
        createdAt: "2024.05.01",
        updatedAt: null,
        likeCount: 999,
        commentCount: 1200,
        viewCount: 1200,
        category: CATEGORY_TYPES.RECOMMENDATION,
        thumbnailUrl: "https://i.ibb.co/TR0HqY4/image.jpg",
        published: true,
        contentText:
          "보자마자 반했어요. 책상 위에 올려두면 인테리어처럼 예뻐요.",
      },
      author: {
        id: "5",
        nickname: "은지",
        imageUrl: "",
      },
      createdAt: "2024.05.01",
      isAuthor: false,
      cardType: "small",
    },
  ];

  return (
    <section>
      <SectionTitle>이 향수, 커뮤니티에서는?</SectionTitle>
      <ul className="pl-5 pc:pl-0 flex gap-4 pb-5 overflow-x-auto pc:overflow-x-visible pc:flex-col pc:gap-6 scrollbar-hide pr-5 pc:pr-0 pt-4 tablet:pt-5">
        {mockPosts.map((item) => (
          <li key={item.post.id}>
            <PostCard
              key={item.post.id}
              {...item}
              isCategory={true}
              cardType={POST_CARD_TYPES.DETAIL}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
