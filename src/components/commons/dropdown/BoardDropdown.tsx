"use client";
import { useState } from "react";
import Dropdown from "./DropdownBase";
import { DEFAULT_BOARD, Option, BOARD_OPTIONS } from "@/lib/constants/options";
import { TPostCategory } from "@/lib/queries/community/postQueries";

interface IBoardDropdownProps {
  currentOption?: string;
  id: string;
  ariaLabelledBy?: string;
  onChange?: (category: TPostCategory) => void;
}

export default function BoardDropdown({
  currentOption,
  id,
  ariaLabelledBy,
  onChange,
}: IBoardDropdownProps) {
  const [selectedOption, setSelectedOption] = useState<Option>(
    () =>
      BOARD_OPTIONS.find((option) => option.value === currentOption) ||
      DEFAULT_BOARD
  );

  const handleSortChange = (option: Option) => {
    setSelectedOption(option);
    onChange?.(option.value as TPostCategory);
  };

  return (
    <>
      <Dropdown
        id={id}
        selectedOption={selectedOption}
        currentOption={currentOption}
        options={BOARD_OPTIONS}
        handleChangeOption={handleSortChange}
        ariaLabelledBy={ariaLabelledBy}
        width="tablet:w-[128px]"
      />
    </>
  );
}
