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
  onClick: () => alert("카드 클릭"),
  ...COMMON_TEXT,
};

Default.argTypes = {
  onClose: { control: false, table: { disable: true } },
};

export const Closable = Template.bind({});
Closable.args = {
  cardType: PERFUME_CARD_TYPES.CLOSABLE,
  perfumeImage: COMMON_IMAGES[PERFUME_CARD_TYPES.CLOSABLE],
  onClose: () => alert("삭제 버튼 클릭"),
  ...COMMON_TEXT,
};

Closable.argTypes = {
  onClick: { control: false, table: { disable: true } },
};
