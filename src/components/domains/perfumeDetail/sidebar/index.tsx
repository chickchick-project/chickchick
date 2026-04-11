import React from "react";
import Link from "next/link";
import { PostCard } from "@/components/commons/card/postCard";
import { POST_CARD_TYPES } from "@/shared/constants/post";
import { SectionTitle } from "@/components/commons/sectionTitle";
import { usePerfumeTaggedPosts } from "@/client/hooks/query/usePerfumeQuery";

export const PerfumeDetailSidebar = ({ perfumeId }: { perfumeId: string }) => {
  const { data: posts = [] } = usePerfumeTaggedPosts(perfumeId);

  return (
    <section>
      <SectionTitle>이 향수, 커뮤니티에서는?</SectionTitle>
      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-black-300 text-body-2">
            아직 이 향수에 대한 커뮤니티 글이 없습니다.
          </p>
          <Link href={`/community/post?perfumeId=${perfumeId}`} className="text-primary-500 text-label-2 underline">
            첫 번째로 글을 남겨보세요
          </Link>
        </div>
      ) : (
        <ul className="pl-5 pc:pl-0 flex gap-4 pb-5 overflow-x-auto pc:overflow-x-visible pc:flex-col pc:gap-6 scrollbar-hide pr-5 pc:pr-0 pt-4 tablet:pt-5">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} cardType={POST_CARD_TYPES.DETAIL} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
