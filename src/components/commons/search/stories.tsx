import { Meta, StoryFn } from "@storybook/react";
import {
  SEARCHBAR_PLACEHOLDER_TEXT,
  SearchBar,
  type SearchBarProps,
} from "./SearchBar";

export default {
  title: "Components/SearchBar",
  component: SearchBar,
  argTypes: {},
} as Meta;

const Template: StoryFn<SearchBarProps> = (args) => <SearchBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: SEARCHBAR_PLACEHOLDER_TEXT,
};

export const Focused = Template.bind({});
Focused.args = {
  placeholder: SEARCHBAR_PLACEHOLDER_TEXT,
  value: "",
  autoFocus: true,
};

export const Done = Template.bind({});
Done.args = {
  placeholder: SEARCHBAR_PLACEHOLDER_TEXT,
  value: "시트러스",
};
