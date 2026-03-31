import ICONS from "@/shared/constants/icons";
import Image from "next/image";
import React from "react";

export interface SearchBarProps {
  placeholder?: "perfume" | "community";
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonType?: "submit" | "button";
  maxWidth?: string;
  className?: string;
  isLoading?: boolean;
  [key: string]: unknown;
}

export const SEARCHBAR_PLACEHOLDER_TEXT = {
  perfume: "제품명, 브랜드를 검색하세요.",
  community: "관심있는 주제를 검색해보세요!",
};

export function SearchBar({
  value,
  onChange,
  onClick,
  placeholder,
  buttonType = "button",
  maxWidth = "840px",
  className = "",
  isLoading = false,
  ...rest
}: SearchBarProps) {
  const baseStyle = `
    w-full max-h-10 tablet:h-12 tablet:max-h-[48px]
    rounded-lg px-5 py-3 border flex items-center
    focus:outline-none focus:border-primary-300 text-label-1 tablet:text-body-1
    `;

  const { onKeyDown: restKeyDown, ...inputRest } = rest as {
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    [key: string]: unknown;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (onClick as unknown as (() => void) | undefined)?.();
    }
    restKeyDown?.(e);
  };

  return (
    <div
      className={`relative w-full flex items-center ${className}`}
      style={{ maxWidth }}
    >
      <input
        className={`${baseStyle} pr-10`}
        placeholder={
          placeholder
            ? SEARCHBAR_PLACEHOLDER_TEXT[placeholder]
            : SEARCHBAR_PLACEHOLDER_TEXT.perfume
        }
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        {...inputRest}
      />
      <button
        onClick={onClick}
        type={buttonType}
        disabled={isLoading}
        aria-label="검색"
      >
        {isLoading ? (
          <div
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            role="status"
            aria-label="검색 중"
          >
            <div className="w-5 h-5 border-2 border-primary-300 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <Image
            src={ICONS.Search.src}
            alt="검색"
            width={20}
            height={20}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          />
        )}
      </button>
    </div>
  );
}
