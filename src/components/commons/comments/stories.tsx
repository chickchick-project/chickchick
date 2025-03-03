import { Meta, StoryFn } from "@storybook/react";
import Comment, { type CommentProps } from "./Comment";
import {
  COMMENT_MAX_LENGTH,
  COMMENT_PLACEHOLDERS,
  COMMENT_TYPES,
} from "@/lib/constants/comments";

export default {
  title: "Commons/Comment",
  component: Comment,
  argTypes: {
    type: { control: { type: "radio", options: Object.values(COMMENT_TYPES) } },
    maxLength: { control: "number" },
  },
} as Meta;

const Template: StoryFn<CommentProps> = (args) => <Comment {...args} />;

export const PostComment = Template.bind({});
PostComment.args = {
  type: COMMENT_TYPES.POST,
  placeholder: COMMENT_PLACEHOLDERS[COMMENT_TYPES.POST],
  maxLength: COMMENT_MAX_LENGTH[COMMENT_TYPES.POST],
};

export const ReviewComment = Template.bind({});
ReviewComment.args = {
  type: COMMENT_TYPES.REVIEW,
  placeholder: COMMENT_PLACEHOLDERS[COMMENT_TYPES.REVIEW],
  maxLength: COMMENT_MAX_LENGTH[COMMENT_TYPES.REVIEW],
};

ReviewComment.decorators = [
  (Story) => (
    <div className="w-[608px]">
      <Story />
    </div>
  ),
];
