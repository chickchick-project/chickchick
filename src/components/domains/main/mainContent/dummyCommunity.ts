export interface CommunityPost {
  id: number;
  title: string;
  commentCount: number;
}

// 질문게시판 더미 데이터
export const questionBoard: CommunityPost[] = [
  { id: 1, title: "정당은 법률이 정하", commentCount: 10003 },
  {
    id: 2,
    title: "정당은 법률이 정하는 바에 의하여 국가의 보호를...",
    commentCount: 999,
  },
  { id: 3, title: "정당은 법률이 정하는 바에 의하여", commentCount: 999 },
  { id: 4, title: "정당은 법률이 정", commentCount: 999 },
  { id: 5, title: "정당은 법률이 정하는 바에 의", commentCount: 999 },
  {
    id: 6,
    title: "정당은 법률이 정하는 바에 의하여 국가의 보호를...",
    commentCount: 999,
  },
  { id: 7, title: "정당은 법률이 정하는 바", commentCount: 999 },
  { id: 8, title: "정당은 법률이 정하는 바", commentCount: 999 },
  { id: 9, title: "정당은 법률이 정하는 바", commentCount: 999 },
];

// 추천게시판 더미 데이터
export const recommendBoard: CommunityPost[] = [
  { id: 1, title: "향수 추천 부탁드려요!", commentCount: 120 },
  { id: 2, title: "여름에 어울리는 시원한 향수 있을까요?", commentCount: 87 },
  { id: 3, title: "가성비 좋은 데일리 향수 추천", commentCount: 64 },
  { id: 4, title: "20대 남자 향수 추천해주세요", commentCount: 45 },
  { id: 5, title: "오피스용 무난한 향수 추천", commentCount: 33 },
  { id: 6, title: "여친 선물용 향수 추천받아요", commentCount: 27 },
  { id: 7, title: "가을에 쓰기 좋은 향수 추천", commentCount: 21 },
  { id: 8, title: "지속력 좋은 향수 추천", commentCount: 19 },
  { id: 9, title: "플로럴 계열 향수 추천해 주세요", commentCount: 15 },
];

// 자유게시판 더미 데이터
export const freeBoard: CommunityPost[] = [
  { id: 1, title: "오늘 산 향수 언박싱 후기", commentCount: 43 },
  { id: 2, title: "향수 샘플 나눔합니다!", commentCount: 38 },
  { id: 3, title: "향수 뿌리는 꿀팁 공유해요", commentCount: 29 },
  { id: 4, title: "향수병 예쁘게 보관하는 법", commentCount: 25 },
  { id: 5, title: "향수 공병 인증합니다", commentCount: 18 },
  { id: 6, title: "오늘 날씨랑 어울리는 향수 추천", commentCount: 15 },
  { id: 7, title: "향수 관련 유튜브 추천해요", commentCount: 12 },
  { id: 8, title: "향수 시향 후기 남깁니다", commentCount: 10 },
  { id: 9, title: "오늘의 TMI: 향수 뿌리다 쏟았어요ㅠㅠ", commentCount: 7 },
];

export const boardDataMap: { [key: string]: CommunityPost[] } = {
  question: questionBoard,
  recommend: recommendBoard,
  free: freeBoard,
};
