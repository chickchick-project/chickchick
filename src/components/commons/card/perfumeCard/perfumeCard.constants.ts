const PERFUME_CARD_TYPES = {
  DEFAULT: "default",
  CLOSABLE: "closable",
} as const;

const PERFUME_CARD_STYLES = {
  images: {
    [PERFUME_CARD_TYPES.DEFAULT]: "w-[180px]",
    [PERFUME_CARD_TYPES.CLOSABLE]: "w-[144px]",
  },
  brandName: {
    [PERFUME_CARD_TYPES.DEFAULT]: "text-label-1",
    [PERFUME_CARD_TYPES.CLOSABLE]: "text-label-2",
  },
  perfumeName: {
    [PERFUME_CARD_TYPES.DEFAULT]: "text-body-1",
    [PERFUME_CARD_TYPES.CLOSABLE]: "text-body-2",
  },
  cursor: {
    [PERFUME_CARD_TYPES.DEFAULT]: "cursor-pointer",
    [PERFUME_CARD_TYPES.CLOSABLE]: "cursor-default",
  },
} as const;

export { PERFUME_CARD_STYLES, PERFUME_CARD_TYPES };
