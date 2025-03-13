import Comment from ".";
import {
  COMMENT_MAX_LENGTH,
  COMMENT_PLACEHOLDERS,
  COMMENT_TYPES,
} from "@/lib/constants/comments";

export default {
  title: "Commons/Comment",
  component: Comment,
  argTypes: {
    type: {
      control: {
        type: "radio",
      },
      options: Object.values(COMMENT_TYPES),
    },
    maxLength: { control: "number" },
  },
  decorators: [
    (Story, context) => {
      if (context.args.type === COMMENT_TYPES.REVIEW) {
        return (
          <div className="w-[608px]">
            <Story />
          </div>
        );
      }
      return <Story />;
    },
  ],
} satisfies import("@storybook/react").Meta<typeof Comment>;

export const Default = {
  args: {
    type: COMMENT_TYPES.POST,
    placeholder: COMMENT_PLACEHOLDERS[COMMENT_TYPES.POST],
    maxLength: COMMENT_MAX_LENGTH[COMMENT_TYPES.POST],
  },
};
