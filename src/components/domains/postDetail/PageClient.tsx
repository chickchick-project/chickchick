import CommentSection from "./commentSection";
import PostContent from "./content";
import PostDetailHeader from "./header";
import { CommentResponse } from "@/lib/hono/schemas/comment.schema";
import {
  PostDetailResponse,
  PostStatusResponse,
} from "@/lib/hono/schemas/community.schema";

interface IPostDetailPageClientProps {
  postDetail: PostDetailResponse;
  postStatus: PostStatusResponse;
  initialComments: CommentResponse[] | [];
}

export default function PageClient({
  postDetail,
  postStatus,
  initialComments,
}: IPostDetailPageClientProps) {
  const { content, ...postDetailHeader } = postDetail;

  return (
    <article>
      <PostDetailHeader postStatus={postStatus} {...postDetailHeader} />
      <PostContent
        postId={postDetail.id}
        content={content}
        isAuthor={postDetail.isAuthor}
        relatedPerfumes={[]}
      />
      <CommentSection
        postId={postDetail.id}
        comments={initialComments}
        totalCommentCount={postStatus.commentCount}
      />
    </article>
  );
}
