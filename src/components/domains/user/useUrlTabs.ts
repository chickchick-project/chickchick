import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { SubTabItem } from "./tabs/tabs.type";

interface TabConfig<T extends string> {
  key: T;
  label: string;
}

export const useUrlTabs = <T extends string>(
  tabConfigs: readonly TabConfig<T>[],
  defaultTab: T
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  const isValidTabKey = (key: string | null): key is T => {
    return tabConfigs.some((tab) => tab.key === key);
  };

  const activeTab = isValidTabKey(currentTab) ? currentTab : defaultTab;

  const handleTabChange = (key: T) => {
    router.replace(`?tab=${key}`, { scroll: false });
  };

  const tabItems: SubTabItem<T>[] = useMemo(
    () => tabConfigs.map(({ key, label }) => ({ key, label })),
    [tabConfigs]
  );

  return {
    activeTab,
    handleTabChange,
    tabItems,
  };
};
