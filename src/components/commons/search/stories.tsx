import { Meta, StoryFn } from "@storybook/react";
import { SearchBar, type SearchBarProps } from "./SearchBar";

export default {
  title: "Components/SearchBar",
  component: SearchBar,
  argTypes: {},
} as Meta;

const Template: StoryFn<SearchBarProps> = (args) => <SearchBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: "제품명, 브랜드를 검색하세요.",
};

export const Focused = Template.bind({});
Focused.args = {
  placeholder: "제품명, 브랜드를 검색하세요.",
  value: "",
  autoFocus: true,
};

export const Done = Template.bind({});
Done.args = {
  placeholder: "제품명, 브랜드를 검색하세요.",
  value: "시트러스",
};
