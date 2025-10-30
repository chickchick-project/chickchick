import clsx from "clsx";
import { cloneElement, isValidElement, ReactElement } from "react";

export const INTERACTION_TYPES = {
  LIKE: "like",
  BOOKMARK: "bookmark",
  SHARE: "share",
};

type InteractionType =
  (typeof INTERACTION_TYPES)[keyof typeof INTERACTION_TYPES];

interface InteractionItem {
  type: InteractionType;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon: ReactElement<{ isActive: boolean }>;
  label?: string;
}

interface InteractionsProps {
  items: InteractionItem[];
}

export const Interactions = ({ items }: InteractionsProps) => {
  return (
    <nav aria-label="상호작용 버튼 모음">
      <ul className="flex gap-3 items-center">
        {items.map(({ type, isActive, icon, onClick, label, disabled }) => (
          <li key={type}>
            <button
              onClick={onClick}
              disabled={disabled}
              aria-label={label ?? type}
              className={clsx(
                "transition-colors duration-200 hover:text-secondary",
                isActive ? "text-secondary" : "text-black-300"
              )}
            >
              {isValidElement(icon) &&
                cloneElement(icon, {
                  isActive,
                })}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
