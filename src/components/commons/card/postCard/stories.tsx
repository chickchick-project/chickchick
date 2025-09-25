import dayjs from "dayjs";
import { PostCardProps } from "./postCard.types";
import { PostCard } from ".";

const CARD_TYPE = {
  SMALL: "small",
  DEFAULT: "default",
  DETAIL: "detail",
} as const;

export default {
  title: "Components/Card/PostCard",
  component: PostCard,
  parameters: {
    controls: {
      include: ["cardType", "isAuthor", "isCategory"],
    },
  },
  argTypes: {
    cardType: {
      control: {
        type: "select",
      },
      options: Object.values(CARD_TYPE),
    },
    isAuthor: { control: "boolean" },
    isCategory: { control: "boolean" },
  },
} satisfies import("@storybook/react").Meta<typeof PostCard>;

const COMMON_TEXT = {
  title:
    "제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목",
  content:
    "국무총리는 국무위원의 해임을 대통령에게 건의할 수 있다. 국회의원의 수는 법률로 정하되, 200인 이상으로 한다. 선거에 관한 경비는 법률이 정하는 경우를 제외하고는 정당 또는 후보자에게 부담시킬 수 없다. 대한민국은 국제평화의 유지에 노력하고 침략적 전쟁을 부인한다.",
  author: {
    id: "test-user-id",
    nickname: "주현",
    imageUrl: "",
  },
  createdAt: dayjs().subtract(1, "hour").toDate(),
};


const COMMON_ARGS: Partial<PostCardProps> = {
  title: COMMON_TEXT.title,
  content: COMMON_TEXT.content,
  author: COMMON_TEXT.author,
  createdAt: COMMON_TEXT.createdAt,
  category: "QUESTION",
  isAuthor: false,
};

export const Default = {
  args: {
    ...COMMON_ARGS,
    cardType: CARD_TYPE.DEFAULT,
    thumbnail: "https://placehold.co/100",
    isCategory: false,
    isAuthor: false,
  },
};
