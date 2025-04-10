import { Meta } from "@storybook/react";
import InputBase, { type InputBaseProps } from ".";

export default {
  title: "Commons/InputBase",
  component: InputBase,
  argTypes: {
    isError: { control: "boolean" },
    helperText: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof InputBase>;

const Template = (args: InputBaseProps) => <InputBase {...args} />;

export const Default = {
  render: Template,
  args: {
    helperText: "헬퍼 텍스트",
    placeholder: "플레이스홀더",
  },
};

export const Focus = {
  render: Template,
  args: {
    helperText: "입력 중...",
    placeholder: "포커스 상태",
    autoFocus: true,
  },
};

export const Error = {
  render: Template,
  args: {
    isError: true,
    helperText: "오류가 발생했습니다.",
    placeholder: "에러 상태",
  },
};
