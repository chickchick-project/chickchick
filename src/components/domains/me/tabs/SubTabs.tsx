"use client";

import { useState } from "react";

type SubTabItem<T extends string> = {
  key: T;
  label: string;
  content: React.ReactNode;
};

type SubTabSwitcherProps<T extends string> = {
  tabs: SubTabItem<T>[];
  defaultKey?: T;
};

export function SubTabSwitcher<T extends string>({
  tabs,
  defaultKey,
}: SubTabSwitcherProps<T>) {
  const [current, setCurrent] = useState<T>(defaultKey ?? tabs[0].key);

  return (
    <>
      <div className="flex space-x-2 border-b mb-4">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCurrent(key)}
            className={`px-3 pb-4 text-sm font-title-2 border-b-2 text-black-100 ${
              current === key
                ? "border-primary-200 font-semibold"
                : "border-transparent font-regular"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div>{tabs.find((t) => t.key === current)?.content}</div>
    </>
  );
}
