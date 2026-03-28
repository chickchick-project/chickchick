"use client";

import "@/components/commons/ckeditor5/ck-content.css";
import type { ApiPerfumeSimpleResponse } from "@/server/hono/schemas/perfume.schema";
import PostActions from "../header/PostActions";
import RelatedPerfume from "./RelatedPerfume";

interface IPostContent {
  content: string;
  isAuthor?: boolean;
  relatedPerfumes: ApiPerfumeSimpleResponse[] | [];
  postId: string;
}

export default function PostContent({
  content,
  isAuthor,
  relatedPerfumes = [],
  postId,
}: IPostContent) {
  const hasRelatedPerfumes = relatedPerfumes && relatedPerfumes.length > 0;

  return (
    <section>
      <div className="px-4">
        <div
          className="ck-content text-body-1 font-medium text-black-100 leading-6 mb-40 min-h-[400px]"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div className="flex justify-end pb-5 tablet:hidden">
          {isAuthor && <PostActions section="content" postId={postId} />}
        </div>
      </div>
      {hasRelatedPerfumes && (
        <div className="divider-horizontal-thick block tablet:hidden" />
      )}
      <div className="px-4 tablet:mb-[60px]">
        {hasRelatedPerfumes && <RelatedPerfume perfumes={relatedPerfumes} />}
        {/* <PostNavigation /> */}
      </div>
    </section>
  );
}
