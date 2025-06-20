const PERFUME_CARD_TYPES = {
  DEFAULT: "default",
  CLOSABLE: "closable",
  SMALLSIZE: "smallSize",
} as const;

const PERFUME_CARD_STYLES = {
  images: {
    [PERFUME_CARD_TYPES.DEFAULT]: "w-auto min-w-[100px]",
    [PERFUME_CARD_TYPES.CLOSABLE]: "w-[144px]",
    [PERFUME_CARD_TYPES.SMALLSIZE]: "w-[80px]",
  },
  brandName: {
    [PERFUME_CARD_TYPES.DEFAULT]: "text-label-1",
    [PERFUME_CARD_TYPES.CLOSABLE]: "text-label-2",
    [PERFUME_CARD_TYPES.SMALLSIZE]: "text-label-3",
  },
  perfumeName: {
    [PERFUME_CARD_TYPES.DEFAULT]: "text-body-1",
    [PERFUME_CARD_TYPES.CLOSABLE]: "text-body-2",
    [PERFUME_CARD_TYPES.SMALLSIZE]: "text-label-2",
  },
  cursor: {
    [PERFUME_CARD_TYPES.DEFAULT]: "cursor-pointer",
    [PERFUME_CARD_TYPES.CLOSABLE]: "cursor-default",
    [PERFUME_CARD_TYPES.SMALLSIZE]: "cursor-pointer",
  },
} as const;

export { PERFUME_CARD_STYLES, PERFUME_CARD_TYPES };
