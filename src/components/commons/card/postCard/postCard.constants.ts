const POST_CARD_TYPES = {
  SMALL: "small",
  DEFAULT: "default",
  DETAIL: "detail",
} as const;

const THUMBNAIL_SIZES = {
  [POST_CARD_TYPES.SMALL]: { width: 80, height: 80 },
  [POST_CARD_TYPES.DEFAULT]: { width: 100, height: 100 },
  [POST_CARD_TYPES.DETAIL]: { width: 307, height: 180 },
} as const;

const CATEGORY_TYPES = {
  QUESTION: "QUESTION",
  FREEBOARD: "FREEBOARD",
  RECOMMENDATION: "RECOMMENDATION",
} as const;

const CATEGORY_LABELS = {
  [CATEGORY_TYPES.QUESTION]: "질문게시판",
  [CATEGORY_TYPES.FREEBOARD]: "자유게시판",
  [CATEGORY_TYPES.RECOMMENDATION]: "추천게시판",
} as const;

const POST_CARD_STYLES = {
  [POST_CARD_TYPES.SMALL]: "w-[540px] h-[198px]",
  [POST_CARD_TYPES.DEFAULT]: "tablet:w-[580px] h-[227px]",
  [POST_CARD_TYPES.DETAIL]: "w-[356px] h-[450px]",
} as const;

export {
  THUMBNAIL_SIZES,
  CATEGORY_TYPES,
  CATEGORY_LABELS,
  POST_CARD_TYPES,
  POST_CARD_STYLES,
};
