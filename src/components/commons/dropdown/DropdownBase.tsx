import DropdownButton from "./DropdownButton";
import DropdownMenu from "./DropdownMenu";
import Image from "next/image";
import ICONS from "@/shared/constants/icons";
import { Option } from "@/shared/constants/options";
import { useVisibilityStore } from "@/client/stores/uiStore";

interface IFilterDropdownProps {
  id: string;
  selectedOption: Option;
  options: Option[];
  currentOption?: string | null;
  handleChangeOption: (option: Option) => void;
  ariaLabelledBy?: string;
  width?: string;
}

export default function Dropdown({
  id,
  selectedOption,
  options,
  currentOption,
  handleChangeOption,
  ariaLabelledBy,
  width,
}: IFilterDropdownProps) {
  const isSelected = !!currentOption;
  const isOpen = useVisibilityStore((state) => state.isOpen(id));
  const toggle = useVisibilityStore((state) => state.toggle);

  const arrowIcon = isSelected ? ICONS.ArrowDownPrimary : ICONS.ArrowDownGray;

  const handleSelectOption = (option: Option) => {
    handleChangeOption(option);
    toggle(id);
  };

  return (
    <div className="relative inline-block">
      <DropdownButton
        onClick={() => toggle(id)}
        isSelected={isSelected}
        className={width ? width : `tablet:min-w-[117px]`}
        {...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {})}
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
