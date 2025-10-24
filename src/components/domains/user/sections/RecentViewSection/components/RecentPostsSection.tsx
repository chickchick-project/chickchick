import { PostCard } from "@/components/commons/card/postCard";
import { ScrollRowSection } from "@/components/domains/user/components/ScrollRowSection";
import { useRecentPosts } from "../hooks/useRecentPosts";

interface RecentPostsSectionProps {
  isTabletOrLarger: boolean | undefined;
}

export const RecentPostsSection = ({
  isTabletOrLarger,
}: RecentPostsSectionProps) => {
  const recentPosts = useRecentPosts(isTabletOrLarger);

  if (!recentPosts.isHydrated) {
    return null;
  }

  return (
    <ScrollRowSection
      title="최근에 본 게시글"
      hasPrev={recentPosts.pagination.hasPrev}
      hasNext={recentPosts.pagination.hasNext}
      onPrev={recentPosts.pagination.handlePrev}
      onNext={recentPosts.pagination.handleNext}
    >
      <div className="flex flex-col gap-4 tablet:grid pc:grid-cols-2 tablet:grid-cols-1 tablet:gap-x-4">
        {recentPosts.isEmpty ? (
          <span className="text-gray-500 text-center tablet:col-span-2">
            최근에 본 게시글이 없습니다.
          </span>
        ) : (
          recentPosts.posts.map((item) => (
            <PostCard
              key={item.id}
              {...item.post}
              updatedAt={item.updatedAt}
              isAuthor={false}
              cardType={"small"}
            />
          ))
        )}
      </div>
    </ScrollRowSection>
  );
};
