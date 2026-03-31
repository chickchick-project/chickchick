import { memo, useState, useEffect } from "react";
import Image from "next/image";
import { Option } from "@/shared/constants/options";
import { useFilterStore } from "@/client/stores/perfumeStore";
import { useVisibilityStore } from "@/client/stores/uiStore";
import ICONS from "@/shared/constants/icons";
import FilterItemModal from "../modal/ItemModal";
import FilterTriggerButton from "@/components/commons/dropdown/DropdownButton";
import { getFilterOptionMeta } from "./filter.helper";

const FilterItem = ({
  category,
  label,
  options,
}: {
  category: string;
  label: string;
  options: Option[];
}) => {
  const EMPTY_SET = new Set<string>();
  const committedFilters = useFilterStore((state) => state.committedFilters);
  const handlePendingChange = useFilterStore((state) => state.handlePendingChange);
  const handlePendingSingleChange = useFilterStore((state) => state.handlePendingSingleChange);

  const filterSet = committedFilters[category] ?? EMPTY_SET;

  const { selectedOption, currentOption } = getFilterOptionMeta(
    filterSet,
    label,
  );

  const [isSelected, setIsSelected] = useState(!!currentOption);
  const { isOpen, open } = useVisibilityStore();
  const isOpenForId = isOpen(category);

  useEffect(() => {
    setIsSelected(!!currentOption);
  }, [currentOption]);

  const arrowIcon = isSelected ? ICONS.ArrowDownPrimary : ICONS.ArrowDownGray;

  return (
    <div className="flex flex-col items-start">
      <FilterTriggerButton
        onClick={() => open(category)}
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
      </FilterTriggerButton>
      {isOpenForId && (
        <FilterItemModal
          id={category}
          options={options}
          currentOption={currentOption}
          handleChangeOption={(option: Option) => {
            if (category === "gender") {
              handlePendingSingleChange(category, option.value);
            } else {
              handlePendingChange(category, option.value);
            }
          }}
        />
      )}
    </div>
  );
};

export default memo(FilterItem);
