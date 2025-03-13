"use client";
import { DEFAULT_SORT_BY, Option, SORT_BY_OPTIONS, TSortBy } from "@/lib/constants/options";
import { useState } from "react";
import Dropdown from "./dropdownBase";

interface ISortDropdownProps {
  currentOption?: TSortBy;
}

export default function SortDropdown({ currentOption }: ISortDropdownProps) {
  const [selectedOption, setSelectedOption] = useState<Option>(
    () => SORT_BY_OPTIONS.find((option) => option.value === currentOption) || DEFAULT_SORT_BY
  );

  const handleSortChange = (option: Option) => {
    setSelectedOption(option);
  };

  return (
    <>
      <Dropdown
        selectedOption={selectedOption}
        currentOption={currentOption}
        options={SORT_BY_OPTIONS}
        handleChangeOption={handleSortChange}
      />
    </>
  );
}
