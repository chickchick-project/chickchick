interface TabItemConfig {
  getLabel: (isMe?: boolean, nickname?: string) => React.ReactNode;
  value: string;
  isMeOnly?: boolean;
}

interface User {
  id: string;
  nickname: string;
}

type SubTabItem<T extends string = string> = {
  key: T;
  label: string;
};
interface SubTabSwitcherProps<T extends string = string> {
  tabs: SubTabItem<T>[];
  activeTab: T;
  onTabChange: (key: T) => void;
}

export type { TabItemConfig, User, SubTabItem, SubTabSwitcherProps };
