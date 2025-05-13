import ICONS from "@/lib/constants/icons";
import { logout } from "@/lib/database/action/login";

type ButtonType = "button" | "reset" | "submit" | undefined;

export const NAV_PATHS = {
  HOME: "/",
  PERFUMES: "/perfumes",
  COMMUNITY: "/community",
  POST: "/community/post",
  USER: {
    COLLECTION: (id: string) => `/user/${id}/collection`,
    BOOKMARK: (id: string) => `/user/${id}/bookmarks`,
    ACTIVITY: (id: string) => `/user/${id}/activity`,
  },
} as const;

export const NAV_LABELS = {
  PERFUMES: "향수",
  COMMUNITY: "커뮤니티",
  LOGIN: "로그인/회원가입",
} as const;

export const getMyPagePaths = (id: string) => ({
  COLLECTION: NAV_PATHS.USER.COLLECTION(id),
  BOOKMARK: NAV_PATHS.USER.BOOKMARK(id),
  ACTIVITY: NAV_PATHS.USER.ACTIVITY(id),
});

export const getMyPageNavItems = (id: string) => [
  {
    icon: ICONS.Collection,
    label: "나의 컬렉션",
    href: NAV_PATHS.USER.COLLECTION(id),
  },
  {
    icon: ICONS.BookmarkOutlined,
    label: "북마크",
    href: NAV_PATHS.USER.BOOKMARK(id),
  },
  {
    icon: ICONS.Activity,
    label: "내 활동",
    href: NAV_PATHS.USER.ACTIVITY(id),
  },
];

export const NAV_ITEMS_FOOTER = [
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
];

export const MOCK_USER_INFO = {
  id: "test-user",
  nickname: "테스트유저",
  level: 1,
};
