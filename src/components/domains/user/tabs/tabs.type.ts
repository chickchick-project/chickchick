interface TabItemConfig {
  getLabel: (isMe?: boolean, nickname?: string) => React.ReactNode;
  value: string;
  isMeOnly?: boolean;
}

interface User {
  id: string;
  nickname: string;
}

type SubTabKey =
  | "myReviews"
  | "myPosts"
  | "myComments"
  | "likedPerfumes"
  | "likedPosts"
  | "bookmarksPerfumes"
  | "bookmarksPosts";

type SubTabItem = {
  key: SubTabKey;
  label: string;
};

interface SubTabSwitcherProps {
  tabs: SubTabItem[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export type { TabItemConfig, User, SubTabItem, SubTabKey, SubTabSwitcherProps };
