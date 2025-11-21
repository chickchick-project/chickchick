import CommunityListItem from "@/components/commons/list/CommunityListItem";
import { ApiPostDetailCategoryPostResponse } from "@/lib/hono/schemas/community.schema";

interface ICategoryPostListProps {
  posts: ApiPostDetailCategoryPostResponse[] | [];
  currentPostId: string;
}

export default function CategoryPostList({
  posts,
  currentPostId,
}: ICategoryPostListProps) {
  return (
    <div className="divide-y divide-gray-200/50">
      {posts &&
        posts.length > 0 &&
        posts.map((post) => (
          <CommunityListItem
            key={post.id}
            postId={post.id}
            title={post.title}
            commentCount={post.commentCount}
            createdAt={post.createdAt}
            isCurrent={post.id === currentPostId}
            authorName={post.author.nickname}
          />
        ))}
    </div>
  );
}
