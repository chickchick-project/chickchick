import CommunityListItem from "@/components/commons/list/CommunityListItem";
import { ICommunityListItemMock } from ".";

interface ICategoryPostListProps {
  posts: ICommunityListItemMock[];
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
            authorName={post.authorName}
          />
        ))}
    </div>
  );
}
