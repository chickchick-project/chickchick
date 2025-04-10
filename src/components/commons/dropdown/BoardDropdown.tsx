"use client";
import { useState } from "react";
import Dropdown from "./DropdownBase";
import { DEFAULT_BOARD, Option, BOARD_OPTIONS } from "@/lib/constants/options";

interface IBoardDropdownProps {
  currentOption?: string;
}

export default function BoardDropdown({ currentOption }: IBoardDropdownProps) {
  const [selectedOption, setSelectedOption] = useState<Option>(
    () =>
      BOARD_OPTIONS.find((option) => option.value === currentOption) ||
      DEFAULT_BOARD
  );

  const handleSortChange = (option: Option) => {
    setSelectedOption(option);
  };

  return (
    <>
      <Dropdown
        id={""}
        selectedOption={selectedOption}
        currentOption={currentOption}
        options={BOARD_OPTIONS}
        handleChangeOption={handleSortChange}
      />
    </>
  );
}
