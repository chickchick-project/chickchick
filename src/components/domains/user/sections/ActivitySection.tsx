import ReviewCard from "@/components/commons/card/reviewCard";
import PerfumeCard from "@/components/commons/card/perfumeCard";
import { SubTabSwitcher } from "../tabs/SubTabs";
import { MOCK_REVIEW_CARD } from "./__mocks__ /reviewCard";
import { PostCard } from "@/components/commons/card/postCard";
import { MOCK_POST_CARD } from "./__mocks__ /postCard";
import { MOCK_PERFUME_CARD } from "./__mocks__ /perfumeCard";
import { MOCK_REPLY } from "./__mocks__ /reply";
import Reply from "../Rely";
import { ActivityData } from "./type";

export const ActivitySection = ({ data }: { data: ActivityData }) => {
  return (
    <SubTabSwitcher
      defaultKey="myReviews"
      tabs={[
        {
          key: "myReviews",
          label: "나의 리뷰",
          content: (
            <ul className="space-y-2">
              {data.myReviews.map((item) => (
                <ReviewCard
                  chips={[]}
                  isAuthor={true}
                  key={item.id}
                  {...MOCK_REVIEW_CARD}
                  isMyPage
                />
              ))}
            </ul>
          ),
        },
        {
          key: "myPosts",
          label: "내가 쓴 게시글",
          content: (
            <ul className="space-y-2">
              {data.myPosts.map((item) => (
                <PostCard
                  id={item.id.toString()}
                  key={item.id}
                  {...MOCK_POST_CARD}
                />
              ))}
            </ul>
          ),
        },
        {
          key: "myComments",
          label: "내가 쓴 댓글",
          content: (
            <ul className="space-y-2">
              {data.myComments.map((item, idx) => (
                <Reply
                  key={item.id}
                  {...MOCK_REPLY}
                  isLast={idx === data.myComments.length - 1}
                />
              ))}
            </ul>
          ),
        },
        {
          key: "likedPerfumes",
          label: "좋아요 한 향수",
          content: (
            <ul className="grid grid-cols-5 gap-4">
              {data.likedPerfumes.map((item) => (
                <PerfumeCard key={item.id} {...MOCK_PERFUME_CARD} />
              ))}
            </ul>
          ),
        },
        {
          key: "likedPosts",
          label: "좋아요 한 글",
          content: (
            <ul className="space-y-2">
              {data.likedPosts.map((item) => (
                <PostCard
                  id={item.id.toString()}
                  key={item.id}
                  {...MOCK_POST_CARD}
                />
              ))}
            </ul>
          ),
        },
      ]}
    />
  );
};
