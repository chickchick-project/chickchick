import { ApiPostDetailResponse } from "@/lib/hono/schemas/community.schema";
import { useState } from "react";
import CategoryPostListHeader from "./Header";
import CategoryPostList from "./CategoryPostList";
import PostListPagination from "./PostListPagination";
import PostListMobileSwiper from "./PostListMobileSwiper";

interface ICommunityListItem {
  category: ApiPostDetailResponse["category"];
}

export interface ICommunityListItemMock {
  id: string;
  title: string;
  commentCount: string;
  createdAt: string;
  authorName: string;
}

const COMMUNITY_LIST_MOCK_DATA: ICommunityListItemMock[] = [
  {
    id: "1",
    title: "오늘 날씨 정말 좋네요. 다들 뭐하시나요?",
    commentCount: "5",
    createdAt: "2025-10-30T16:33:00.000Z",
    authorName: "하늘바라기",
  },
  {
    id: "2",
    title: "향수 추천 부탁드려요! 가을에 어울리는 향수 찾고 있습니다.",
    commentCount: "112",
    createdAt: "2025-10-30T10:30:00.000Z",
    authorName: "오래된뉴비",
  },
  {
    id: "3",
    title: "어떤 향수가 좋을까요",
    commentCount: "3",
    createdAt: "2025-10-30T10:26:00.000Z",
    authorName: "햄햄군",
  },
  {
    id: "4",
    title: "안녕하세요. 처음 인사드려용",
    commentCount: "1",
    createdAt: "2025-10-29T16:24:00.000Z",
    authorName: "코히",
  },
  {
    id: "5",
    title:
      "제목이 엄청나게 길어질 경우 어떻게 되는지 테스트하기 위한 아주 긴 텍스트입니다. 제목 길이 제한이 어떻게 적용되는지 확인해보세요.",
    commentCount: "10",
    createdAt: "2025-10-29T09:35:00.000Z",
    authorName: "닉네임이엄청나게긴사람",
  },
  {
    id: "6",
    title: "다음페이지1",
    commentCount: "10",
    createdAt: "2025-10-29T09:36:00.000Z",
    authorName: "닉네임이엄청나게긴사람",
  },
  {
    id: "7",
    title: "다음페이지2",
    commentCount: "10",
    createdAt: "2025-10-29T09:37:00.000Z",
    authorName: "닉네임이엄청나게긴사람",
  },
  {
    id: "8",
    title: "다음페이지3",
    commentCount: "10",
    createdAt: "2025-10-29T09:38:00.000Z",
    authorName: "닉네임이엄청나게긴사람",
  },
  {
    id: "9",

    title: "다음페이지4",
    commentCount: "10",
    createdAt: "2025-10-29T09:39:00.000Z",
    authorName: "닉네임이엄청나게긴사람",
  },
  {
    id: "10",
    title: "다음페이지5",
    commentCount: "10",
    createdAt: "2025-10-29T09:40:00.000Z",
    authorName: "닉네임이엄청나게긴사람",
  },
  {
    id: "11",
    title: "다음페이지6",
    commentCount: "10",
    createdAt: "2025-10-29T09:41:00.000Z",
    authorName: "닉네임이엄청나게긴사람",
  },
];

const ITEMS_PER_PAGE = 5;

export default function CategoryPostListSection({
  category,
}: ICommunityListItem) {
  const currentPostId = "2";
  const postList = COMMUNITY_LIST_MOCK_DATA;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItemsCount = postList.length;
  const totalPages = Math.ceil(totalItemsCount / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const desktopItems = postList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="w-full mt-8 px-4 pc:px-0">
      <CategoryPostListHeader category={category} />

      <div className="block tablet:hidden">
        <PostListMobileSwiper posts={postList} currentPostId={currentPostId} />
      </div>

      {/* 타블렛, 데스크탑: 현재 페이지에 해당하는 5개만 보여줌 */}
      <div className="hidden tablet:block">
        <CategoryPostList posts={desktopItems} currentPostId={currentPostId} />
        <PostListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}
