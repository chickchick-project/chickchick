"use client";

import { useState } from "react";
import { SubTabSwitcherProps } from "./tabs.type";

export function SubTabSwitcher({ tabs, defaultKey }: SubTabSwitcherProps) {
  const [current, setCurrent] = useState(defaultKey ?? tabs[0].key);

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
