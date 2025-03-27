import ReviewCard from ".";
import {
  ReviewStatusType,
  InfoType,
} from "@/components/commons/author/author.constants";
import dayjs from "dayjs";

const COMMON_TEXT = {
  brand: "르 라보",
  title: "떼 마차 26 EDP",
  review:
    "국무총리는 국무위원의 해임을 대통령에게 건의할 수 있다. 국회의원의 수는 법률로 정하되, 200인 이상으로 한다. 선거에 관한 경비는 법률이 정하는 경우를 제외하고는 정당 또는 후보자에게 부담시킬 수 없다. 대한민국은 국제평화의 유지에 노력하고 침략적 전쟁을 부인한다.",
  author: "주현",
  createdAt: dayjs().subtract(1, "hour").toISOString(),
};

export default {
  title: "Components/Card/ReviewCard",
  component: ReviewCard,
  parameters: {
    controls: {
      include: ["isMyPage"],
    },
  },
  argTypes: {
    isMyPage: { control: "boolean" },
  },
} satisfies import("@storybook/react").Meta<typeof ReviewCard>;

export const Default = {
  args: {
    brand: COMMON_TEXT.brand,
    title: COMMON_TEXT.title,
    review: COMMON_TEXT.review,
    createdAt: COMMON_TEXT.createdAt,
    info: {
      type: "review",
      item: { status: "지금 쓰고 있어요" as ReviewStatusType },
    } as InfoType,
    isMyPage: true,
  },
};
