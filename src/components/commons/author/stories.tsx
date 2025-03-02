import { Meta, StoryFn } from "@storybook/react";
import AuthorInfo, {
  type AuthorInfoProps,
  REVIEW_STATUSES,
  SIZE_STATUSES,
} from "./AuthorInfo";
import dayjs from "dayjs";

export default {
  title: "Commons/AuthorInfo",
  component: AuthorInfo,
  argTypes: {
    size: { control: { type: "radio", options: Object.values(SIZE_STATUSES) } },
    isAuthor: { control: "boolean" },
    profileImage: { control: "boolean" },
    "info.type": { control: { type: "radio", options: ["post", "review"] } },
  },
} as Meta;

const AUTHOR_INFO = {
  author: "주현",
  profileImage: "https://placehold.co/28",
};

const TIMESTAMP = {
  now: dayjs().subtract(1, "hour").toISOString(), // "1시간 전"
  specificDate: dayjs("2024-12-19").toISOString(), // 특정 날짜
};

const Template: StoryFn<AuthorInfoProps> = (args) => (
  <div className="flex flex-col gap-2">
    <div className="flex">
      <AuthorInfo {...args} size={SIZE_STATUSES.DEFAULT} />
    </div>
    <div className="flex">
      <AuthorInfo {...args} size={SIZE_STATUSES.LARGE} />
    </div>
  </div>
);

export const Default: StoryFn<AuthorInfoProps> = Template.bind({});
Default.args = {
  ...AUTHOR_INFO,
  createdAt: TIMESTAMP.now,
  isAuthor: false,
  size: SIZE_STATUSES.DEFAULT,
};

// `OnlyTime` (작성자 정보 없이 시간만 표시)
export const OnlyTime: StoryFn<AuthorInfoProps> = Template.bind({});
OnlyTime.args = {
  createdAt: TIMESTAMP.now,
  profileImage: undefined,
  isAuthor: true,
};

// `OnlyTimeWithAuthor` (작성자 포함, 시간만 표시)
export const OnlyTimeWithAuthor: StoryFn<AuthorInfoProps> = Template.bind({});
OnlyTimeWithAuthor.args = {
  ...AUTHOR_INFO,
  createdAt: TIMESTAMP.now,
  isAuthor: false,
};

// `ReviewStatus` (리뷰 상태 표시)
export const ReviewStatus = Template.bind({});
ReviewStatus.args = {
  ...AUTHOR_INFO,
  createdAt: TIMESTAMP.now,
  isAuthor: false,
  info: {
    type: "review",
    item: { status: REVIEW_STATUSES.NOW },
  },
};

// `ReviewWithDate` (특정 날짜 + 리뷰 상태)
export const ReviewWithDate: StoryFn<AuthorInfoProps> = Template.bind({});
ReviewWithDate.args = {
  ...AUTHOR_INFO,
  createdAt: TIMESTAMP.specificDate,
  isAuthor: false,
  info: {
    type: "review",
    item: { status: REVIEW_STATUSES.WANT },
  },
};
