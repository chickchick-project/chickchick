import ICONS from "@/lib/constants/icons";
import Image from "next/image";
import React from "react";

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  [key: string]: unknown;
}

export const SEARCHBAR_PLACEHOLDER_TEXT = "제품명, 브랜드를 검색하세요.";

export function SearchBar({
  value,
  onChange,
  onClick,
  ...rest
}: SearchBarProps) {
  const baseStyle = `
    w-full max-w-[840px] h-12 max-h-[48px]
    rounded-lg px-5 py-3 border flex items-center
    focus:outline-none focus:border-primary-300
    `;

  return (
    <div className="relative w-full max-w-[840px] flex items-center">
      <input
        className={`${baseStyle} pr-10`}
        placeholder={SEARCHBAR_PLACEHOLDER_TEXT}
        value={value}
        onChange={onChange}
        {...rest}
      />
      <button onClick={onClick}>
        <Image
          src={ICONS.Search.src}
          alt="Search"
          width={20}
          height={20}
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
        />
      </button>
    </div>
  );
}
