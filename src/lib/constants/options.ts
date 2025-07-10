import { PostCategory } from "@prisma/client";

export type TSortBy = "latest" | "popular";
export type TApiSortBy = "createdAt" | "popular";

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

export const SORT_MAPPING_COMMUNITY_FOR_API: Record<TSortBy, TApiSortBy> = {
  latest: "createdAt",
  popular: "popular",
};

//게시판 글쓰기 드롭다운 메뉴
export const DEFAULT_BOARD: Option<TBoardType> = {
  label: "게시판 선택",
  value: "",
};
export const BOARD_OPTIONS: Option<TBoardType>[] = [
  { label: "질문게시판", value: PostCategory.QUESTION },
  { label: "추천게시판", value: PostCategory.RECOMMENDATION },
  { label: "자유게시판", value: PostCategory.FREEBOARD },
];
