import PerfumeCard from "@/components/commons/card/perfumeCard";
import { CommunityBookmark } from "../sections.type";
import { PostCard } from "@/components/commons/card/postCard";
import { mockCommunityPostData } from "@/lib/mocks/communityCard";
import { POST_CARD_TYPES } from "@/lib/constants/post";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";

const renderPerfumeBookmarks = (perfumes: PerfumeBaseResponse[]) => {
  if (perfumes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        북마크한 향수가 없습니다.
      </div>
    );
  }
  // console.log(perfumes);
  return (
    <div className="grid grid-cols-5 gap-[52px]">
      {perfumes.map((item, idx) => (
        <PerfumeCard
          key={`${item.id}-${idx}`}
          perfumeImage={item.perfumeImage?.imageUrl || null}
          brandName={item.brand.nameKo || item.brand.nameEn}
          perfumeName={item.nameKo || item.nameEn}
        />
      ))}
    </div>
  );
};

const renderCommunityBookmarks = (communityPosts: CommunityBookmark[]) => {
  const itemsToRender = Array.from({ length: 2 }).flatMap(() => communityPosts);

  if (itemsToRender.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        북마크한 게시글이 없습니다.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-y-5">
      {itemsToRender.map((item, idx) => (
        <PostCard
          key={`${item.id}-${idx}`}
          {...mockCommunityPostData[idx]}
          cardType={POST_CARD_TYPES.SMALL}
          isCategory={true}
          isAuthor={false}
        />
      ))}
    </div>
  );
};

export { renderPerfumeBookmarks, renderCommunityBookmarks };
