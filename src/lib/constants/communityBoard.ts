export type TBoardType = keyof typeof BOARD_TYPES;
export type TCommunityBoardType = keyof typeof COMMUNITY_BOARDS;

export const BOARD_TYPES = {
  QUESTION: "질문게시판",
  RECOMMENDATION: "추천게시판",
  FREEBOARD: "자유게시판",
};

export const COMMUNITY_BOARDS = { best: "베스트 게시글", ...BOARD_TYPES };
