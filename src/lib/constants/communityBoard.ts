export type TBoardType = keyof typeof BOARD_TYPES;
export type TCommunityBoardType = keyof typeof COMMUNITY_BOARDS;

export const BOARD_TYPES = {
  question: "질문게시판",
  recommend: "추천게시판",
  free: "자유게시판",
};

export const COMMUNITY_BOARDS = { ...BOARD_TYPES, best: "베스트 게시글" };
