import type { Meta, StoryObj } from "@storybook/react";
import BoardChip from "./boardChip";
import AccordChip from "./accordChip";
import ReviewChip from "./reviewChip";
import LevelChip from "./levelChip";
import { BOARD_TYPES, TBoardType } from "@/lib/constants/communityBoard";
import { ACCORDS, TAccords } from "@/lib/constants/accords";

const meta: Meta = {
  title: "Components/Chips",
  argTypes: {},
};

export default meta;

type BoardChipStory = StoryObj<typeof BoardChip>;
type AccordChipStory = StoryObj<typeof AccordChip>;
type ReviewChipStory = StoryObj<typeof ReviewChip>;
type LevelChipStory = StoryObj<typeof LevelChip>;

export const Board: BoardChipStory = {
  render: (args) => <BoardChip {...args} />,
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["s", "m"],
    },
    type: {
      control: { type: "select" },
      options: Object.keys(BOARD_TYPES),
    },
  },
  args: {
    size: "m",
    type: "question" as TBoardType,
  },
};

export const Accord: AccordChipStory = {
  render: (args) => <AccordChip {...args} />,
  argTypes: {
    accord: {
      control: { type: "select" },
      options: Object.keys(ACCORDS),
    },
  },
  args: {
    accord: "floral" as TAccords,
  },
};

//리뷰 라벨 constant로 정리 후 label 수정 필요
export const Review: ReviewChipStory = {
  render: (args) => <ReviewChip {...args} />,
  argTypes: {
    label: { control: { type: "text" } },
    count: { control: { type: "number", min: 1, max: 10, step: 1 } },
  },
  args: { label: "👍 최고예요!" },
};

export const Level: LevelChipStory = {
  render: (args) => <LevelChip {...args} />,
  argTypes: { level: { control: { type: "number", min: 1, max: 5, step: 1 } } },
  args: { level: 3 },
};

export const AllChips: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2">Board Chips</h3>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(BOARD_TYPES).map((type) => (
            <BoardChip key={type} size="m" type={type as TBoardType} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-2">Accord Chips</h3>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(ACCORDS).map((accord) => (
            <AccordChip key={accord} accord={accord as TAccords} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-2">Review Chips</h3>
        <div className="flex gap-2 flex-wrap">
          <ReviewChip label="👍 최고예요!" />
          <ReviewChip count={6} />
        </div>
      </div>
      <div>
        <h3 className="mb-2">Level Chip</h3>
        <div className="flex gap-2 flex-wrap">
          <LevelChip level={1} />
        </div>
      </div>
    </div>
  ),
};
