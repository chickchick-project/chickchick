import { Meta, StoryFn } from "@storybook/react";
import { useState } from "react";
import { LikeIcon } from "./icons/LikeIcon";
import { BookmarkIcon } from "./icons/BookmarkIcon";
import { ShareIcon } from "./icons/ShareIcon";
import { INTERACTION_TYPES, Interactions } from ".";

export default {
  title: "Components/Interactions",
  component: Interactions,
} as Meta;

const Template: StoryFn = () => {
  const [activeStates, setActiveStates] = useState({
    like: false,
    bookmark: false,
  });

  const toggle = (key: keyof typeof activeStates) => {
    setActiveStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Interactions
      items={[
        {
          type: INTERACTION_TYPES.LIKE,
          isActive: activeStates.like,
          icon: <LikeIcon />,
          onClick: () => toggle("like"),
          label: "좋아요",
        },
        {
          type: INTERACTION_TYPES.BOOKMARK,
          isActive: activeStates.bookmark,
          icon: <BookmarkIcon />,
          onClick: () => toggle("bookmark"),
          label: "북마크",
        },
        {
          type: INTERACTION_TYPES.SHARE,
          icon: <ShareIcon />,
          onClick: () => alert("공유!"),
          label: "공유",
        },
      ]}
    />
  );
};

export const Default = Template.bind({});
