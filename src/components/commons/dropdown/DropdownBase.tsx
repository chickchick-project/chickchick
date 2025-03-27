import DropdownButton from "./DropdownButton";
import DropdownMenu from "./DropdownMenu";
import Image from "next/image";
import ICONS from "@/lib/constants/icons";
import { Option } from "@/lib/constants/options";
import { useState, useEffect } from "react";
import { useVisibilityStore } from "@/lib/stores/useVisibilityStore";

interface IFilterDropdownProps {
  id: string;
  selectedOption: Option;
  options: Option[];
  currentOption?: string;
  handleChangeOption: (option: Option) => void;
}

export default function Dropdown({
  id,
  selectedOption,
  options,
  currentOption,
  handleChangeOption,
}: IFilterDropdownProps) {
  const [isSelected, setIsSelected] = useState(!!currentOption);
  const isOpen = useVisibilityStore((state) => state.isOpen(id));
  const toggle = useVisibilityStore((state) => state.toggle);
  useEffect(() => {
    setIsSelected(!!currentOption);
  }, [currentOption]);

  const arrowIcon = isSelected ? ICONS.ArrowDownPrimary : ICONS.ArrowDownGray;

  const handleSelectOption = (option: Option) => {
    handleChangeOption(option);
    setIsSelected(true);
  };

  return (
    <div className="relative inline-block">
      <DropdownButton
        onClick={() => toggle(id)}
        isSelected={isSelected}
        className="tablet:w-[117px]"
      >
        {selectedOption.label}
        <Image
          src={arrowIcon.src}
          alt={arrowIcon.alt}
          width={16}
          height={16}
          className="w-3 h-3 tablet:w-4 tablet:h-4"
        />
      </DropdownButton>
      {isOpen && (
        <DropdownMenu
          handleSelectOption={handleSelectOption}
          options={options}
        />
      )}
    </div>
  );
}
