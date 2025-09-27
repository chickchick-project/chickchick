interface TabItemConfig {
  getLabel: (isMe?: boolean, nickname?: string) => React.ReactNode;
  value: string;
  isMeOnly?: boolean;
}

interface User {
  id: string;
  nickname: string;
}

type ActivityTabKey =
  | "myReviews"
  | "myPosts"
  | "myComments"
  | "likedPerfumes"
  | "likedPosts";

type BookmarkTabKey = "bookmarksPerfumes" | "bookmarksPosts";

type SubTabKey = ActivityTabKey | BookmarkTabKey;

type SubTabItem = {
  key: SubTabKey;
  label: string;
};

interface SubTabSwitcherProps {
  tabs: SubTabItem[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export type {
  TabItemConfig,
  User,
  SubTabItem,
  SubTabKey,
  SubTabSwitcherProps,
  ActivityTabKey,
  BookmarkTabKey,
};
