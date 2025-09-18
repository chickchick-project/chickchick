"use client";
import { PostRelatedPerfumeResponse } from "@/lib/hono/schemas/community.schema";
import PostActions from "../header/PostActions";
import RelatedPerfume from "./RelatedPerfume";
import { useSanitizedHtml } from "@/lib/hooks/useSanitizedHtml";

interface IPostContent {
  content: string;
  isAuthor?: boolean;
  relatedPerfumes: PostRelatedPerfumeResponse[] | [];
  postId: string;
}

export default function PostContent({
  content,
  isAuthor,
  relatedPerfumes = [],
  postId,
}: IPostContent) {
  const sanitizedContent = useSanitizedHtml(content);

  const hasRelatedPerfumes = relatedPerfumes && relatedPerfumes.length > 0;

  return (
    <section>
      <div className="px-4">
        <div
          className="ck-content text-body-1 font-medium text-black-100 leading-6 mb-40"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
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
      <div className="divider-horizontal-thick block tablet:hidden mb-10" />
    </section>
  );
}
