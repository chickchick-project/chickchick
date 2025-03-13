export type TSortBy = "latest" | "popular";
export type TSortByMAPPING = "신상품" | "베스트";
export type TBoardType = "question" | "recommend" | "free";

export type Option<TValue = string> = {
  label: string;
  value: TValue | "";
};

export const DEFAULT_SORT_BY: Option<TSortBy> = { label: "베스트", value: "popular" };
export const SORT_BY_OPTIONS: Option<TSortBy>[] = [
  { label: "신상품", value: "latest" }, // "latest"로 수정
  DEFAULT_SORT_BY,
];

export const DEFAULT_BOARD: Option<TBoardType> = { label: "게시판 선택", value: "" };
export const BOARD_OPTIONS: Option<TBoardType>[] = [
  { label: "질문게시판", value: "question" },
  { label: "추천게시판", value: "recommend" },
  { label: "자유게시판", value: "free" },
];
