import type React from "react";

interface TabItem {
  label: React.ReactNode;
  value: string;
}

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
  autoScrollOnChange?: boolean;
  scrollBehavior?: ScrollBehavior;
  scrollDelayMs?: number;
}

export type { TabItemConfig, User, SubTabItem, SubTabSwitcherProps, TabItem };
