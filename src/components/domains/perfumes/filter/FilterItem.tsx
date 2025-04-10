import { memo, useState, useEffect } from "react";
import Image from "next/image";
import { Option } from "@/lib/constants/options";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { useVisibilityStore } from "@/lib/stores/useVisibilityStore";
import ICONS from "@/lib/constants/icons";
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
  const filterSet = useFilterStore(
    (state) => state.filters.get(category) ?? EMPTY_SET
  );
  const handleFilterChange = useFilterStore(
    (state) => state.handleFilterChange
  );

  const { selectedOption, currentOption } = getFilterOptionMeta(
    filterSet,
    label
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
            handleFilterChange(category, option.value);
            setIsSelected(true);
          }}
        />
      )}
    </div>
  );
};

export default memo(FilterItem);
