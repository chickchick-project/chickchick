"use client";
import {
  DEFAULT_SORT_BY,
  Option,
  SORT_BY_OPTIONS,
  TSortBy,
} from "@/lib/constants/options";
import Dropdown from "./DropdownBase";

export interface ISortDropdownProps {
  currentOption?: TSortBy | null;
  type: "perfume" | "community";
  onSortChange: (option: Option) => void;
}

export default function SortDropdown({
  currentOption,
  type,
  onSortChange,
}: ISortDropdownProps) {
  const selectedOption =
    SORT_BY_OPTIONS[type].find((option) => option.value === currentOption) ||
    DEFAULT_SORT_BY[type];

  return (
    <>
      <Dropdown
        selectedOption={selectedOption}
        currentOption={currentOption}
        options={SORT_BY_OPTIONS[type]}
        handleChangeOption={onSortChange}
        id="sort-dropdown"
      />
    </>
  );
}
