import CommunityListItem from "@/components/commons/list/CommunityListItem";
import { BOARD_TYPES } from "@/lib/constants/communityBoard";
import { ApiPostDetailResponse } from "@/lib/hono/schemas/community.schema";
import Link from "next/link";
import Image from "next/image";
import ICONS from "@/lib/constants/icons";

interface ICommunityListItem {
  category: ApiPostDetailResponse["category"];
}

interface ICommunityListItemMock {
  postId: string;
  title: string;
  commentCount: string;
  createdAt: string;
  authorName: string;
}

const COMMUNITY_LIST_MOCK_DATA: ICommunityListItemMock[] = [
  {
    postId: "1",
    title: "오늘 날씨 정말 좋네요. 다들 뭐하시나요?",
    commentCount: "5",
    createdAt: "2025-10-30T16:33:00.000Z",
    authorName: "하늘바라기",
  },
  {
    postId: "2",
    title: "향수 추천 부탁드려요! 가을에 어울리는 향수 찾고 있습니다.",
    commentCount: "112",
    createdAt: "2025-10-30T10:30:00.000Z",
    authorName: "오래된뉴비",
  },
  {
    postId: "3",
    title: "어떤 향수가 좋을까요",
    commentCount: "3",
    createdAt: "2025-10-30T10:26:00.000Z",
    authorName: "햄햄군",
  },
  {
    postId: "4",
    title: "안녕하세요. 처음 인사드려용",
    commentCount: "1",
    createdAt: "2025-10-29T16:24:00.000Z",
    authorName: "코히",
  },
  {
    postId: "5",
    title:
      "제목이 엄청나게 길어질 경우 어떻게 되는지 테스트하기 위한 아주 긴 텍스트입니다. 제목 길이 제한이 어떻게 적용되는지 확인해보세요.",
    commentCount: "10",
    createdAt: "2025-10-29T09:35:00.000Z",
    authorName: "닉네임이엄청나게긴사람",
  },
];
export default function CommunityListSection({ category }: ICommunityListItem) {
  const currentPostId = 2;

  return (
    <section className="w-full mt-8 px-4 pc:px-0">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-title-2 tablet:text-title-1 font-semibold tablet:mb-3">
          <Link
            href={`/community?tab=${category}`}
            className="flex items-center gap-1 tablet:hidden active:opacity-70"
          >
            <span className="text-primary-100">{BOARD_TYPES[category]}</span>
            다른글
            <Image
              src={ICONS.ArrowRightGray.src}
              alt={ICONS.ArrowRightGray.alt}
              width={16}
              height={16}
            />
          </Link>
          <span className="hidden tablet:block cursor-default">
            <span className="text-primary-100">{BOARD_TYPES[category]}</span>{" "}
            다른글
          </span>
        </h1>
        <Link
          href={`/community?tab=${category}`}
          className="hidden tablet:block"
        >
          전체보기
        </Link>
      </div>
      <div className="divide-y divide-gray-200/50">
        {COMMUNITY_LIST_MOCK_DATA.map((item, i) => (
          <CommunityListItem
            key={i}
            postId={item.postId}
            title={item.title}
            commentCount={item.commentCount}
            createdAt={item.createdAt}
            isCurrent={i === currentPostId}
            authorName={item.authorName}
          />
        ))}
      </div>
    </section>
  );
}
