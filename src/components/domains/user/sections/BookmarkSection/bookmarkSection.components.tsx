import PerfumeCard from "@/components/commons/card/perfumeCard";
import { PostCard } from "@/components/commons/card/postCard";
import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";
import { POST_CARD_TYPES } from "@/lib/constants/post";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";
import Link from "next/link";

const PerfumeBookmarkList = ({
  perfumes,
}: {
  perfumes: PerfumeBaseResponse[];
}) => {
  if (perfumes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        북마크한 향수가 없습니다.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-5 gap-[52px]">
      {perfumes.map((item, idx) => (
        <Link key={item.id} href={`/perfumes/${item.id}`} passHref>
          <PerfumeCard
            key={`${item.id}-${idx}`}
            cardType="default"
            perfumeImage={item.perfumeImage?.imageUrl || null}
            brandName={item.brand.nameKo || item.brand.nameEn}
            perfumeName={item.nameKo || item.nameEn}
          />
        </Link>
      ))}
    </div>
  );
};

const CommunityBookmarkList = ({
  communityPosts,
}: {
  communityPosts: PostCardProps[];
}) => {
  if (communityPosts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        북마크한 게시글이 없습니다.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-y-5">
      {communityPosts.map((item) => (
        <Link key={item.id} href={`/community/post/${item.id}`}>
          <PostCard
            key={item.id}
            {...item}
            isAuthor={false}
            isCategory={true}
            cardType={POST_CARD_TYPES.SMALL}
          />
        </Link>
      ))}
    </div>
  );
};

export { PerfumeBookmarkList, CommunityBookmarkList };
