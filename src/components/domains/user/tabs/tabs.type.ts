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
  content: React.ReactNode;
};

type SubTabSwitcherProps = {
  tabs: SubTabItem[];
  defaultKey?: SubTabKey;
};

export type { TabItemConfig, User, SubTabItem, SubTabSwitcherProps };
