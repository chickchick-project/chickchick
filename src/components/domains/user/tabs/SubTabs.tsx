import { SubTabSwitcherProps } from "./tabs.type";

export function SubTabSwitcher({
  tabs,
  activeTab,
  onTabChange,
}: SubTabSwitcherProps) {
  return (
    <div className="flex space-x-2 border-b mb-4">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
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
