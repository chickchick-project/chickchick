import { PostCategory } from "@prisma/client";

export type TSortBy = "latest" | "popular";
export type TSortByMAPPING = "신상품" | "베스트";
export type TSortByCommunityMAPPING = "최신순" | "인기순";
export type TBoardType = PostCategory;

export type Option<TValue = string> = {
  label: string;
  value: TValue | "";
};

//향수 정렬
export const DEFAULT_SORT_BY_PERFUME: Option<TSortBy> = {
  label: "베스트",
  value: "popular",
};
export const SORT_BY_OPTIONS_PERFUME: Option<TSortBy>[] = [
  { label: "신상품", value: "latest" }, // "latest"로 수정
  DEFAULT_SORT_BY_PERFUME,
];
//커뮤니티 정렬
export const DEFAULT_SORT_BY_COMMUNITY: Option<TSortBy> = {
  label: "최신순",
  value: "latest",
};
export const SORT_BY_COMMUNITY_OPTIONS: Option<TSortBy>[] = [
  { label: "인기순", value: "popular" },
  DEFAULT_SORT_BY_COMMUNITY,
];

export const DEFAULT_SORT_BY = {
  perfume: DEFAULT_SORT_BY_PERFUME,
  community: DEFAULT_SORT_BY_COMMUNITY,
};
export const SORT_BY_OPTIONS = {
  perfume: SORT_BY_OPTIONS_PERFUME,
  community: SORT_BY_COMMUNITY_OPTIONS,
};

//게시판 글쓰기 드롭다운 메뉴
export const DEFAULT_BOARD: Option<TBoardType> = {
  label: "게시판 선택",
  value: "",
};
export const BOARD_OPTIONS: Option<TBoardType>[] = [
  { label: "질문게시판", value: "QUESTION" },
  { label: "추천게시판", value: "RECOMMENDATION" },
  { label: "자유게시판", value: "FREEBOARD" },
];
