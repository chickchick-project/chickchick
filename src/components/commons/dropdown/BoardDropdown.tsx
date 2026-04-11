"use client";
import { useState } from "react";
import Dropdown from "./DropdownBase";
import { DEFAULT_BOARD, Option, BOARD_OPTIONS } from "@/shared/constants/options";
import { PostCategory } from "@/server/hono/schemas/community.schema";

interface IBoardDropdownProps {
  currentOption?: string | null;
  id: string;
  ariaLabelledBy?: string;
  onChange?: (category: PostCategory) => void;
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
    onChange?.(option.value as PostCategory);
  };
  const width = "tablet:w-[128px]";

  return (
    <div className={width}>
      <Dropdown
        id={id}
        selectedOption={selectedOption}
        currentOption={currentOption}
        options={BOARD_OPTIONS}
        handleChangeOption={handleSortChange}
        ariaLabelledBy={ariaLabelledBy}
        width={width}
      />
    </div>
  );
}
