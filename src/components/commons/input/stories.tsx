import { Meta, StoryFn } from "@storybook/react";
import { InputBase, type InputBaseProps } from "./inputBase";

export default {
  title: "Commons/InputBase",
  component: InputBase,
  argTypes: {
    isError: { control: "boolean" },
    helperText: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
} as Meta;

const DefaultTemplate: StoryFn<InputBaseProps> = (args) => (
  <InputBase {...args} />
);
export const Default = DefaultTemplate.bind({});
Default.args = {
  helperText: "헬퍼 텍스트",
  placeholder: "플레이스홀더",
};

const FocusTemplate: StoryFn<InputBaseProps> = (args) => (
  <InputBase {...args} autoFocus={true} />
);
export const Focus = FocusTemplate.bind({});
Focus.args = {
  helperText: "입력 중...",
  placeholder: "포커스 상태",
};

const DoneTemplate: StoryFn<InputBaseProps> = (args) => (
  <InputBase {...args} value="완료된 입력" />
);
export const Done = DoneTemplate.bind({});
Done.args = {
  helperText: "입력이 완료되었습니다.",
  placeholder: "입력 완료",
};

const ErrorTemplate: StoryFn<InputBaseProps> = (args) => (
  <InputBase {...args} isError={true} />
);
export const Error = ErrorTemplate.bind({});
Error.args = {
  helperText: "오류가 발생했습니다.",
  placeholder: "에러 상태",
};
