import Link from "next/link";
import Image from "next/image";
import ICONS from "@/lib/constants/icons";
import { BOARD_TYPES } from "@/lib/constants/communityBoard";
import { ApiPostDetailResponse } from "@/lib/hono/schemas/community.schema";

interface CommunityListHeaderProps {
  category: ApiPostDetailResponse["category"];
}

export default function CategoryPostListHeader({
  category,
}: CommunityListHeaderProps) {
  return (
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
        className="hidden tablet:block text-black-200 text-body-3"
      >
        전체보기
      </Link>
    </div>
  );
}
