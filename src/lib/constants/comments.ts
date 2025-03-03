export const COMMENT_TYPES = {
  POST: "post",
  REVIEW: "review",
} as const;

export const COMMENT_PLACEHOLDERS = {
  [COMMENT_TYPES.POST]: "댓글을 입력하세요",
  [COMMENT_TYPES.REVIEW]: "후기를 적어주세요(선택 사항)",
} as const;

export const COMMENT_MAX_LENGTH = {
  [COMMENT_TYPES.POST]: 500,
  [COMMENT_TYPES.REVIEW]: 500,
} as const;
