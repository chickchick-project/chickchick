const getLayoutSize = (isMyPage: boolean) => {
  return {
    articleSize: isMyPage
      ? "w-[504px] h-[220px]"
      : "w-[320px] h-[162px] tablet:w-[704px] tablet:h-[248px]",
    imageSize: isMyPage
      ? { width: 180, height: 180 }
      : { width: 200, height: 200 },
  };
};

export { getLayoutSize };
