import { SubTabSwitcher } from "../tabs/SubTabs";
import { ActivityData } from "./type";
import { SubTabItem } from "../tabs/type";
import {
  renderMyReviews,
  renderMyPosts,
  renderMyComments,
  renderLikedPerfumes,
  renderLikedPosts,
} from "./helper";

const subTabItems = (data: ActivityData): SubTabItem[] => [
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

export const ActivitySection = ({ data }: { data: ActivityData }) => {
  return <SubTabSwitcher defaultKey="myReviews" tabs={subTabItems(data)} />;
};
