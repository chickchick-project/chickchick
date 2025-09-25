import dayjs from "dayjs";
import AuthorInfo from "./AuthorInfo";
import { REVIEW_STATUSES, SIZE_STATUSES } from "./author.constants";
import { AuthorInfoProps } from "./author.types";

const AUTHOR_INFO = {
  id: "test-user-id",
  nickname: "주현",
  imageUrl: "",
} as const;

const defaultProfileImage = "/images/Profile.svg";

const TIMESTAMP = {
  now: dayjs().subtract(1, "hour").toDate(), // "1시간 전"
  specificDate: dayjs("2024-12-19").toDate(), // 특정 날짜
  withTime: dayjs().toDate(),
} as const;

const INFO_OPTIONS = {
  ProfileTime: "ProfileTime",
  DateReview: "DateReview",
  ProfileDateTime: "ProfileDateTime",
  ProfileDateState: "ProfileDateState",
} as const;

export default {
  title: "Commons/AuthorInfo",
  component: AuthorInfo,
  parameters: {
    controls: {
      include: ["displayType", "size", "isAuthor", "profileImage"],
    },
  },
  argTypes: {
    displayType: {
      control: { type: "radio" },
      options: Object.values(INFO_OPTIONS),
    },
    size: {
      control: {
        type: "radio",
      },
      options: Object.values(SIZE_STATUSES),
    },
    isAuthor: { control: "boolean" },
  } as Partial<Record<string, unknown>>,
} satisfies import("@storybook/react").Meta<typeof AuthorInfo>;

const Template = ({ displayType, ...args }: AuthorInfoProps & { displayType: string }) => {
  let modifiedArgs = { ...args };

  switch (displayType) {
    case INFO_OPTIONS.ProfileTime:
      modifiedArgs = {
        ...modifiedArgs,
        author: { ...AUTHOR_INFO, imageUrl: defaultProfileImage },
        createdAt: TIMESTAMP.now,
        info: { type: "basic" },
      };
      break;

    case INFO_OPTIONS.DateReview:
      modifiedArgs = {
        ...modifiedArgs,
        author: AUTHOR_INFO,
        createdAt: TIMESTAMP.specificDate,
        info: { type: "review", item: { status: REVIEW_STATUSES.WANT } },
      };
      break;

    case INFO_OPTIONS.ProfileDateTime:
      modifiedArgs = {
        ...modifiedArgs,
        author: { ...AUTHOR_INFO, imageUrl: defaultProfileImage },
        createdAt: TIMESTAMP.withTime,
        info: { type: "comment" },
      };
      break;

    case INFO_OPTIONS.ProfileDateState:
      modifiedArgs = {
        ...modifiedArgs,
        author: { ...AUTHOR_INFO, imageUrl: defaultProfileImage },
        createdAt: TIMESTAMP.specificDate,
        info: {
          type: "post",
          item: [
            { type: "Comment", count: 999 },
            { type: "View", count: 999 },
          ],
        },
      };
      break;
  }

  return (
    <div className="flex">
      <AuthorInfo {...modifiedArgs} />
    </div>
  );
};

export const Default = {
  render: Template,
  args: {
    displayType: INFO_OPTIONS.ProfileTime,
    author: AUTHOR_INFO,
    createdAt: TIMESTAMP.now,
    isAuthor: false,
    size: SIZE_STATUSES.DEFAULT,
  },
};
