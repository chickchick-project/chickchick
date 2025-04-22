import { REVIEW_STATUSES } from "@/components/commons/author/author.constants";
import { ReviewCardProps } from "@/components/commons/card/reviewCard";

export const dummyReview: ReviewCardProps = {
  brand: "르 라보",
  title: "떼 마차 26 EDP",
  review:
    "상쾌하면서도 깊은 우디 향이 인상적이에요. 잔향이 오래 남아서 하루 종일 기분이 좋아집니다. 데일리로 쓰기에도 부담 없고, 특별한 날에도 잘 어울려요!",
  createdAt: "2024-04-20",
  info: {
    type: "review",
    item: {
      status: REVIEW_STATUSES.NOW, // "지금 쓰고 있어요"
    },
  },
  chips: ["상쾌함", "우디", "지속력좋음", "데일리", "특별한 날"],
  imageUrl:
    "https://wvedpvxspndgyoisudyr.supabase.co/storage/v1/object/public/perfume_image/perfumes/375x500.31172.jpg",
  isMyPage: false,
  isAuthor: false,
};
