import { Meta, StoryFn } from "@storybook/react";
import dayjs from "dayjs";
import { PostCard, type PostCardProps } from ".";
import { PostMetaItem } from "@/lib/constants/author";

const CARD_TYPE = {
  SMALL: "small",
  DEFAULT: "default",
  DETAIL: "detail",
} as const;

export default {
  title: "Components/PostCard",
  component: PostCard,
  argTypes: {
    cardType: {
      control: {
        type: "select",
        options: [CARD_TYPE.SMALL, CARD_TYPE.DEFAULT, CARD_TYPE.DETAIL],
      },
    },
    isAuthor: {
      control: "boolean",
    },
    isCategory: {
      control: "boolean",
    },
  },
} as Meta;

const COMMON_TEXT = {
  title:
    "제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목제목",
  content:
    "국무총리는 국무위원의 해임을 대통령에게 건의할 수 있다. 국회의원의 수는 법률로 정하되, 200인 이상으로 한다. 선거에 관한 경비는 법률이 정하는 경우를 제외하고는 정당 또는 후보자에게 부담시킬 수 없다. 대한민국은 국제평화의 유지에 노력하고 침략적 전쟁을 부인한다. 대통령은 조국의 평화적 통일을 위한 성실한 의무를 진다. 국회의 정기회는 법률이 정하는 바에 의하여 매년 1회 집회되며, 국회의 임시회는 대통령 또는 국회재적의원 4분의 1 이상의 요구에 의하여 집회된다.",
  author: "주현",
  createdAt: dayjs().subtract(1, "hour").toISOString(),
};

const COMMON_META: PostMetaItem[] = [
  { type: "Like", count: 999 },
  {
    type: "Comment",
    count: 1200,
  },
  {
    type: "View",
    count: 1200,
  },
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
  categoryType: "question",
};

const Template: StoryFn<PostCardProps> = (args) => (
  <div className="flex flex-col gap-4">
    {/* 카테고리 있음, 작성자 아님 */}
    <PostCard {...args} isCategory={true} isAuthor={false} />
    {/* 카테고리 있음, 작성자 */}
    <PostCard {...args} isCategory={true} isAuthor={true} />
    {/* 카테고리 없음, 작성자 아님 */}
    <PostCard {...args} isCategory={false} isAuthor={false} />
    {/* 카테고리 없음, 작성자 */}
    <PostCard {...args} isCategory={false} isAuthor={true} />
  </div>
);

export const Small = Template.bind({});
Small.args = {
  ...COMMON_ARGS,
  cardType: CARD_TYPE.SMALL,
  thumbnail: COMMON_IMAGES.thumbnails[CARD_TYPE.SMALL],
};

export const Default = Template.bind({});
Default.args = {
  ...COMMON_ARGS,
  cardType: CARD_TYPE.DEFAULT,
  thumbnail: COMMON_IMAGES.thumbnails[CARD_TYPE.DEFAULT],
};

export const Detail = Template.bind({});
Detail.args = {
  ...COMMON_ARGS,
  cardType: CARD_TYPE.DETAIL,
  thumbnail: COMMON_IMAGES.thumbnails[CARD_TYPE.DETAIL],
};
