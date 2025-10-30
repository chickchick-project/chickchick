import React, { forwardRef, useEffect } from "react";
import { SubTabSwitcherProps } from "./tabs.type";

const getSelfY = (el: HTMLDivElement | null) => {
  if (typeof window === "undefined" || !el) return 0;
  const rect = el.getBoundingClientRect();
  const computedTop = parseInt(window.getComputedStyle(el).top || "0", 10) || 0;
  return rect.top + window.scrollY - computedTop;
};

function SubTabSwitcherInner<T extends string = string>(
  {
    tabs,
    activeTab,
    onTabChange,
    autoScrollOnChange,
    scrollBehavior = "smooth",
    scrollDelayMs = 0,
  }: SubTabSwitcherProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  useEffect(() => {
    if (!autoScrollOnChange) return;
    if (typeof window === "undefined") return;
    const run = () => {
      const el = (ref as React.MutableRefObject<HTMLDivElement | null>)
        ?.current;
      const y = getSelfY(el);
      window.scrollTo({ top: y, behavior: scrollBehavior });
    };
    const id = window.setTimeout(() => {
      requestAnimationFrame(() => requestAnimationFrame(run));
    }, scrollDelayMs);
    return () => window.clearTimeout(id);
  }, [activeTab, autoScrollOnChange, scrollBehavior, scrollDelayMs, ref]);

  const handleClick = (key: T) => {
    onTabChange(key);
    if (!autoScrollOnChange) return;
    if (typeof window === "undefined") return;
    const run = () => {
      const el = (ref as React.MutableRefObject<HTMLDivElement | null>)
        ?.current;
      const y = getSelfY(el);
      window.scrollTo({ top: y, behavior: scrollBehavior });
    };
    window.setTimeout(() => {
      requestAnimationFrame(() => requestAnimationFrame(run));
    }, scrollDelayMs);
  };

  return (
    <div
      ref={ref}
      className="tablet:static sticky top-[108px] z-10 bg-white pt-2 -mt-2 flex space-x-2 border-b mb-4"
    >
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => handleClick(key)}
          className={`px-3 pb-4 text-sm font-title-2 border-b-2 text-black-100 ${
            activeTab === key
              ? "border-primary-200 font-semibold"
              : "border-transparent font-regular"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export const SubTabSwitcher = forwardRef(SubTabSwitcherInner) as (<
  T extends string = string
>(
  props: SubTabSwitcherProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement | null) & { displayName?: string };

SubTabSwitcher.displayName = "SubTabSwitcher";
