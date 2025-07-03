import dayjs from "dayjs";
import { PostMetaItem } from "../../author/author.types";
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
  author: "주현",
  createdAt: dayjs().subtract(1, "hour").toISOString(),
};

const COMMON_META: PostMetaItem[] = [
  { type: "Like", count: 999 },
  { type: "Comment", count: 1200 },
  { type: "View", count: 1200 },
];

const COMMON_IMAGES = {
  profile: "https://placehold.co/28",
  thumbnails: {
    [CARD_TYPE.SMALL]: "https://placehold.co/80",
    [CARD_TYPE.DEFAULT]: "https://placehold.co/100",
    [CARD_TYPE.DETAIL]: "https://placehold.co/308x180",
  },
};

const COMMON_ARGS: Partial<PostCardProps> = {
  title: COMMON_TEXT.title,
  content: COMMON_TEXT.content,
  author: COMMON_TEXT.author,
  createdAt: COMMON_TEXT.createdAt,
  meta: COMMON_META,
  profileImage: COMMON_IMAGES.profile,
  categoryType: "QUESTION",
};

export const Default = {
  args: {
    ...COMMON_ARGS,
    cardType: CARD_TYPE.DEFAULT,
    thumbnail: COMMON_IMAGES.thumbnails[CARD_TYPE.DEFAULT],
    isCategory: false,
    isAuthor: false,
  },
};
