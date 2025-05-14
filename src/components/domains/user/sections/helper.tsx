import ReviewCard from "@/components/commons/card/reviewCard";
import { PostCard } from "@/components/commons/card/postCard";
import PerfumeCard from "@/components/commons/card/perfumeCard";
import Reply from "../Reply";
import { MOCK_REVIEW_CARD } from "./__mocks__ /reviewCard";
import { MOCK_POST_CARD } from "./__mocks__ /postCard";
import { MOCK_REPLY } from "./__mocks__ /reply";
import { MOCK_PERFUME_CARD } from "./__mocks__ /perfumeCard";
import { ActivityData } from "./type";

const renderMyReviews = (data: ActivityData) =>
  data.myReviews.length > 0 ? (
    <ul className="space-y-2">
      {data.myReviews.map((item) => (
        <ReviewCard
          chips={item.chips ?? []}
          isAuthor={item.isAuthor}
          key={item.id}
          {...MOCK_REVIEW_CARD}
          isMyPage={item.isMyPage}
        />
      ))}
    </ul>
  ) : (
    <div className="text-center py-8 text-gray-500">
      작성한 리뷰가 없습니다.
    </div>
  );

const renderMyPosts = (data: ActivityData) =>
  data.myPosts.length > 0 ? (
    <ul className="space-y-2">
      {data.myPosts.map((item) => (
        <PostCard
          id={item.id.toString()}
          key={item.id}
          {...MOCK_POST_CARD}
          isAuthor={item.isAuthor}
        />
      ))}
    </ul>
  ) : (
    <div className="text-center py-8 text-gray-500">
      작성한 게시글이 없습니다.
    </div>
  );

const renderMyComments = (data: ActivityData) => (
  <ul className="space-y-2">
    {data.myComments.map((item, idx) => (
      <Reply
        key={item.id}
        {...MOCK_REPLY}
        postInfo={{
          id: item.postId.toString(),
          title: "[서울 동대문구]올리브영 향수 나눔합니다!",
        }}
        isLast={idx === data.myComments.length - 1}
      />
    ))}
  </ul>
);

const renderLikedPerfumes = (data: ActivityData) =>
  data.likedPerfumes.length > 0 ? (
    <ul className="grid grid-cols-5 gap-4">
      {data.likedPerfumes.map((item) => (
        <PerfumeCard key={item.id} {...MOCK_PERFUME_CARD} />
      ))}
    </ul>
  ) : (
    <div className="text-center py-8 text-gray-500">
      좋아요 한 향수가 없습니다.
    </div>
  );

const renderLikedPosts = (data: ActivityData) =>
  data.likedPosts.length > 0 ? (
    <ul className="space-y-2">
      {data.likedPosts.map((item) => (
        <PostCard id={item.id.toString()} key={item.id} {...MOCK_POST_CARD} />
      ))}
    </ul>
  ) : (
    <div className="text-center py-8 text-gray-500">
      좋아요 한 게시글이 없습니다.
    </div>
  );

export {
  renderMyReviews,
  renderMyPosts,
  renderMyComments,
  renderLikedPerfumes,
  renderLikedPosts,
};
