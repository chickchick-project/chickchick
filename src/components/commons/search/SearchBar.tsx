import React from "react";
import Image from "next/image";
import SearchIcon from "public/icons/Search.svg";

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

const PLACEHOLDER_TEXT = "제품명, 브랜드를 검색하세요.";

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const baseStyle = `
    w-full max-w-[840px] h-12 max-h-[48px]
    rounded-lg px-5 py-3 border flex items-center
    focus:outline-none focus:border-primary-300
    `;

  return (
    <div className="relative w-full max-w-[840px] flex items-center">
      <input
        className={`${baseStyle} pr-10`}
        placeholder={PLACEHOLDER_TEXT}
        value={value}
        onChange={onChange}
        {...rest}
      />
      <Image
        src={SearchIcon}
        alt="Search"
        width={20}
        height={20}
        className="absolute right-4 top-1/2 transform -translate-y-1/2"
      />
    </div>
  );
};
