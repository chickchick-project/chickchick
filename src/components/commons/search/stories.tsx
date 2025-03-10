import { Meta } from "@storybook/react";
import {
  SEARCHBAR_PLACEHOLDER_TEXT,
  SearchBar,
  type SearchBarProps,
} from "./SearchBar";

export default {
  title: "Components/SearchBar",
  component: SearchBar,
  parameters: {
    controls: {
      include: ["value"],
    },
  },
  argTypes: {
    value: { control: "text" },
  },
} satisfies Meta<typeof SearchBar>;

const Template = (args: SearchBarProps) => <SearchBar {...args} />;

export const Default = {
  render: Template,
  args: {
    placeholder: SEARCHBAR_PLACEHOLDER_TEXT,
  },
};

export const Focus = {
  render: Template,
  args: {
    autoFocus: true,
  },
};

export const Done = {
  render: Template,
  args: {
    value: "시트러스",
  },
};
