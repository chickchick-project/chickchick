import { Meta, StoryObj } from "@storybook/react";
import { waitFor, within, userEvent } from "@storybook/test";
import { action } from "@storybook/addon-actions";
// import { useState } from "react";
import NavBar, { NavBarProps } from ".";

export default {
  title: "Components/NavBar",
  component: NavBar,
  parameters: {
    controls: {
      include: ["isLoggedIn", "currentPath"],
    },
  },
  argTypes: {
    // isLoggedIn: {
    //   control: { type: "boolean" },
    // },
    currentPath: {
      control: { type: "radio" },
      options: ["홈", "향수", "커뮤니티"],
      mapping: {
        홈: "/",
        향수: "/perfumes",
        커뮤니티: "/community",
      },
      defaultValue: "홈",
    },
  },
} satisfies Meta<NavBarProps>;

const NavBarWrapper = (args: NavBarProps) => {
  return <NavBar {...args} />;
};

const Template = (args: NavBarProps) => <NavBar {...args} />;

export const Default = {
  render: Template,
  args: {
    isLoggedIn: false,
    currentPath: "/",
  },
};

export const AutoLogin: StoryObj<NavBarProps> = {
  render: (args) => <NavBarWrapper {...args} />,
  args: {
    // isLoggedIn: false,
    currentPath: "/",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const loginButton = await canvas.findByRole("button");

    await waitFor(
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        action("로그인 버튼 클릭됨")({
          buttonText: loginButton.textContent,
          role: loginButton.getAttribute("role"),
        });
        await userEvent.click(loginButton);
      },
      { timeout: 5000 }
    );
  },
};
