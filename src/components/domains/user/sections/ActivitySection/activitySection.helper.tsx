import ReviewCard from "@/components/commons/card/reviewCard";
import { PostCard } from "@/components/commons/card/postCard";
import PerfumeCard from "@/components/commons/card/perfumeCard";
import { ActivityData } from "../sections.type";
import Reply from "../../Reply";
import { SubTabItem } from "../../tabs/tabs.type";
import { mockReviewCardData } from "@/lib/mocks/reviewCard";
import { mockPerfumeCardData } from "@/lib/mocks/perfumeCard";
import { mockReplyData } from "@/lib/mocks/reply";
import { mockPostCardData } from "@/lib/mocks/postCard";
import { POST_CARD_TYPES } from "@/lib/constants/post";

//TODO: Mock Data를 실제 데이터로 변경하는 작업이 필요함.

const renderMyReviews = (data: ActivityData) =>
  data.myReviews.length > 0 ? (
    <ul className="space-y-2">
      {data.myReviews.map((item) => (
        <ReviewCard key={item.id} {...mockReviewCardData} />
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
          key={item.id}
          {...mockPostCardData}
          isAuthor={false}
          meta={mockPostCardData.meta}
          isCategory={true}
          cardType={POST_CARD_TYPES.SMALL}
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
        {...mockReplyData}
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
        <PerfumeCard key={item.id} {...mockPerfumeCardData} />
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
        <PostCard key={item.id} {...mockPostCardData} />
      ))}
    </ul>
  ) : (
    <div className="text-center py-8 text-gray-500">
      좋아요 한 게시글이 없습니다.
    </div>
  );

const getRenderableActivitySubTabItems = (data: ActivityData): SubTabItem[] => [
  {
    key: "myReviews",
    label: "나의 리뷰",
    content: renderMyReviews(data),
  },
  {
    key: "myPosts",
    label: "내가 쓴 게시글",
    content: renderMyPosts(data),
  },
  {
    key: "myComments",
    label: "내가 쓴 댓글",
    content: renderMyComments(data),
  },
  {
    key: "likedPerfumes",
    label: "좋아요 한 향수",
    content: renderLikedPerfumes(data),
  },
  {
    key: "likedPosts",
    label: "좋아요 한 글",
    content: renderLikedPosts(data),
  },
];

export { getRenderableActivitySubTabItems };
