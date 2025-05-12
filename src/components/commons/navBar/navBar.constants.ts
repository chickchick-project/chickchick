import ICONS from "@/lib/constants/icons";
import { logout } from "@/lib/database/action/login";

type ButtonType = "button" | "reset" | "submit" | undefined;

export const NAV_PATHS = {
  HOME: "/",
  PERFUMES: "/perfumes",
  COMMUNITY: "/community",
  POST: "/community/post",
  ME: {
    COLLECTION: "/me/collection",
    BOOKMARK: "/me/bookmarks",
    ACTIVITY: "/me/activity",
  },
} as const;

export const NAV_LABELS = {
  PERFUMES: "향수",
  COMMUNITY: "커뮤니티",
  LOGIN: "로그인/회원가입",
} as const;

export const NAV_MY_INFO = {
  nickname: "내 이름",
  level: 1,
} as const;

export const NAV_ITEMS = {
  myPage: [
    {
      icon: ICONS.Collection,
      label: "나의 컬렉션",
      href: NAV_PATHS.ME.COLLECTION,
    },
    {
      icon: ICONS.BookmarkOutlined,
      label: "북마크",
      href: NAV_PATHS.ME.BOOKMARK,
    },
    { icon: ICONS.Activity, label: "내 활동", href: NAV_PATHS.ME.ACTIVITY },
  ],
  footer: [
    {
      label: "의견 보내기",
      type: "button" as ButtonType,
      onClick: () => {},
    },
    {
      label: "로그아웃",
      type: "submit" as ButtonType,
      action: logout,
    },
  ],
};
