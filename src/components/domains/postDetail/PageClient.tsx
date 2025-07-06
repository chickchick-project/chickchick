import { TPostDetail } from "@/lib/queries/community/postQueries";
import CommentSection from "./commentSection";
import PostContent from "./content";
import PostDetailHeader from "./header";

interface IPostDetailPageClientProps {
  postDetail: TPostDetail;
}

export default function PageClient({ postDetail }: IPostDetailPageClientProps) {
  console.log("PostDetailPageClient", postDetail);
  const { content, isAuthor, ...postDetailHeader } = postDetail;

  return (
    <article className="w-full max-w-[1016px] mb-14 tablet:mb-[260px] ">
      <PostDetailHeader isAuthor={isAuthor} {...postDetailHeader} />
      <PostContent content={content} isAuthor={isAuthor} relatedPerfumes={[]} />
      <CommentSection />
    </article>
  );
}
