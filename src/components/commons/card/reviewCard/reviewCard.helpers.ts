const getLayoutSize = (isMyPage: boolean) => {
  return {
    articleSize: isMyPage
      ? "w-[540px] h-[220px]"
      : "w-full tablet:h-[220px] h-fit",
    // "w-[320px] h-[162px] tablet:w-[704px] tablet:h-[248px]", // 모바일 환경의 리뷰 카드 사이즈 변경(임시)
    imageSize: isMyPage
      ? { width: 180, height: 180 }
      : { width: 200, height: 200 },
  };
};

export { getLayoutSize };
