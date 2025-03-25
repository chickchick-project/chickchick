import { Meta, StoryFn } from "@storybook/react";
import { PERFUME_CARD_TYPES, PerfumeCard, PerfumeCardProps } from ".";

export default {
  title: "Components/Card/PerfumeCard",
  component: PerfumeCard,
} as Meta;

const COMMON_TEXT = {
  brandName: "Brand Name Brand Name Brand Name Brand Name",
  perfumeName: "Perfume Name Perfume Name Perfume Name ",
};

const COMMON_IMAGES = {
  [PERFUME_CARD_TYPES.DEFAULT]: "https://placehold.co/180",
  [PERFUME_CARD_TYPES.CLOSABLE]: "https://placehold.co/144",
};

const Template: StoryFn<PerfumeCardProps> = (args) => <PerfumeCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  cardType: PERFUME_CARD_TYPES.DEFAULT,
  perfumeImage: COMMON_IMAGES[PERFUME_CARD_TYPES.DEFAULT],
  ...COMMON_TEXT,
};

export const Closable = Template.bind({});
Closable.args = {
  cardType: PERFUME_CARD_TYPES.CLOSABLE,
  perfumeImage: COMMON_IMAGES[PERFUME_CARD_TYPES.CLOSABLE],
  ...COMMON_TEXT,
};
