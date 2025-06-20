export const BOTTOM_NAV_BAR_ICONS = (userId: string) => {
  return [
    {
      key: "home",
      src: {
        inactive: "/icons/bottomNavBar/home.svg",
        active: "/icons/bottomNavBar/homeActive.svg",
      },
      alt: "홈",
      href: "/",
    },
    {
      key: "search",
      src: {
        inactive: "/icons/bottomNavBar/search.svg",
        active: "/icons/bottomNavBar/searchActive.svg",
      },
      alt: "검색",
      href: "/perfumes",
    },
    {
      key: "writing",
      src: {
        inactive: "/icons/bottomNavBar/writing.svg",
        active: "/icons/bottomNavBar/writingActive.svg",
      },
      alt: "글쓰기",
      href: "/community/post",
    },
    {
      key: "mypage",
      src: {
        inactive: "/icons/bottomNavBar/mypage.svg",
        active: "/icons/bottomNavBar/mypageActive.svg",
      },
      alt: "마이페이지",
      href: `${userId ? `/user/${userId}/collection` : "/"}`,
    },
  ];
};
