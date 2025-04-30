"use client";
import { DEFAULT_SORT_BY, Option, SORT_BY_OPTIONS, TSortBy } from "@/lib/constants/options";
import { useState } from "react";
import Dropdown from "./DropdownBase";

export interface ISortDropdownProps {
  currentOption?: TSortBy;
  type: "perfume" | "community";
}

export default function SortDropdown({ currentOption, type }: ISortDropdownProps) {
  const [selectedOption, setSelectedOption] = useState<Option>(
    () => SORT_BY_OPTIONS[type].find((option) => option.value === currentOption) || DEFAULT_SORT_BY[type]
  );

  const handleSortChange = (option: Option) => {
    setSelectedOption(option);
  };

  return (
    <>
      <Dropdown
        selectedOption={selectedOption}
        currentOption={currentOption}
        options={SORT_BY_OPTIONS[type]}
        handleChangeOption={handleSortChange}
        id={""}
      />
    </>
  );
}
