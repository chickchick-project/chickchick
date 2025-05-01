export type TBoardType = keyof typeof BOARD_TYPES;
export type TCommunityBoardType = keyof typeof COMMUNITY_BOARDS;

export const BOARD_TYPES = {
  question: "질문게시판",
  recommendation: "추천게시판",
  discussion: "자유게시판",
};

export const COMMUNITY_BOARDS = { best: "베스트 게시글", ...BOARD_TYPES };
