import DropdownButton from "./dropdownButton";
import DropdownMenu from "./dropdownMenu";
import Image from "next/image";
import ICONS from "@/lib/constants/icons";
import { Option } from "@/lib/constants/options";
import { useState } from "react";

interface IFilterDropdownProps {
  selectedOption: Option;
  options: Option[];
  currentOption?: string;
  handleChangeOption: (option: Option) => void;
}

export default function Dropdown({ selectedOption, options, currentOption, handleChangeOption }: IFilterDropdownProps) {
  const [isSelected, setIsSelected] = useState(!!currentOption);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const arrowIcon = isHovered ? ICONS.ArrowDownGray : isSelected ? ICONS.ArrowDownPrimary : ICONS.ArrowDownGray;

  const handleSelectOption = (option: Option) => {
    handleChangeOption(option);
    setIsOpen(false);
    setIsSelected(true);
  };

  return (
    <div className="relative inline-block">
      <DropdownButton
        onClick={() => setIsOpen(true)}
        isSelected={isSelected}
        className="tablet:w-[117px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
      {isOpen && <DropdownMenu handleSelectOption={handleSelectOption} options={options} />}
    </div>
  );
}
