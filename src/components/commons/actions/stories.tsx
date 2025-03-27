import { Meta, StoryFn } from "@storybook/react";
import { ACTION_TYPES, Actions } from ".";

export default {
  title: "Components/Actions",
  component: Actions,
  argTypes: {
    size: {
      options: ["default", "large"],
      control: { type: "radio" },
    },
  },
} as Meta;

const Template: StoryFn<typeof Actions> = (args) => <Actions {...args} />;

export const EditDelete = Template.bind({});
EditDelete.args = {
  size: "default",
  actions: [
    {
      type: ACTION_TYPES.EDIT,
      onClick: () => alert("수정 클릭"),
    },
    {
      type: ACTION_TYPES.DELETE,
      onClick: () => alert("삭제 클릭"),
    },
  ],
};

export const Reply = Template.bind({});
Reply.args = {
  size: "default",
  actions: [
    {
      type: ACTION_TYPES.REPLY,
      onClick: () => alert("답글 클릭"),
    },
  ],
};

export const Submit = Template.bind({});
Submit.args = {
  size: "default",
  actions: [
    {
      type: ACTION_TYPES.SUBMIT,
      onClick: () => alert("완료 클릭"),
    },
  ],
};
