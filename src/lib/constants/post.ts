export const POST_CARD_TYPES = {
  SMALL: "small",
  DEFAULT: "default",
  DETAIL: "detail",
} as const;

export const CATEGORY_TYPES = {
  QUESTION: "QUESTION",
  FREEBOARD: "FREEBOARD",
  RECOMMENDATION: "RECOMMENDATION",
} as const;

export const CATEGORY_LABELS = {
  [CATEGORY_TYPES.QUESTION]: "질문게시판",
  [CATEGORY_TYPES.FREEBOARD]: "자유게시판",
  [CATEGORY_TYPES.RECOMMENDATION]: "추천게시판",
} as const;

export const POST_CARD_STYLES = {
  [POST_CARD_TYPES.SMALL]: "w-[540px] h-[198px]",
  [POST_CARD_TYPES.DEFAULT]: "w-[580px] h-[227px]",
  [POST_CARD_TYPES.DETAIL]: "w-[356px] h-[450px]",
} as const;

export type PostCardType =
  (typeof POST_CARD_TYPES)[keyof typeof POST_CARD_TYPES];
export type CategoryType = (typeof CATEGORY_TYPES)[keyof typeof CATEGORY_TYPES];
