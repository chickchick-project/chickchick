import { NAV_BAR_ICONS } from "@/shared/constants/icons/navBar";

export const BOTTOM_NAV_BAR_ICONS = (userId: string) => {
  return [
    {
      key: "home",
      src: {
        inactive: NAV_BAR_ICONS.home.inactive,
        active: NAV_BAR_ICONS.home.active,
      },
      alt: NAV_BAR_ICONS.home.alt,
      href: "/",
    },
    {
      key: "search",
      src: {
        inactive: NAV_BAR_ICONS.search.inactive,
        active: NAV_BAR_ICONS.search.active,
      },
      alt: NAV_BAR_ICONS.search.alt,
      href: "/perfumes",
    },
    {
      key: "writing",
      src: {
        inactive: NAV_BAR_ICONS.writing.inactive,
        active: NAV_BAR_ICONS.writing.active,
      },
      alt: NAV_BAR_ICONS.writing.alt,
      href: "/community/post",
    },
    {
      key: "mypage",
      src: {
        inactive: NAV_BAR_ICONS.mypage.inactive,
        active: NAV_BAR_ICONS.mypage.active,
      },
      alt: NAV_BAR_ICONS.mypage.alt,
      href: `${userId ? `/user/${userId}/collection` : "/"}`,
    },
  ];
};
