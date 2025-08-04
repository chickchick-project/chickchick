"use client";
import PostActions from "../header/PostActions";
import RelatedPerfume from "./RelatedPerfume";
import PostNavigation from "./postNavigation";
import { useSanitizedHtml } from "@/lib/hooks/useSanitizedHtml";

interface IPostContent {
  content: string;
  isAuthor?: boolean;
  relatedPerfumes?: [];
}

export default function PostContent({
  content,
  isAuthor,
  relatedPerfumes = [],
}: IPostContent) {
  const sanitizedContent = useSanitizedHtml(content);

  return (
    <section>
      <div className="px-4">
        <div
          className="ck-content text-body-2 font-medium text-black-100 leading-6 mb-10"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        <div className="flex justify-end pb-5 tablet:hidden">
          {isAuthor && <PostActions section="content" />}
        </div>
      </div>
      <div className="divider-horizontal-thick block tablet:hidden" />
      <div className="px-4">
        {relatedPerfumes.length > 0 && (
          <RelatedPerfume perfumes={relatedPerfumes} />
        )}
        <PostNavigation />
      </div>
      <div className="divider-horizontal-thick block tablet:hidden mb-10" />
    </section>
  );
}
