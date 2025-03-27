import { memo } from "react";
import { Option } from "@/lib/constants/options";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import Dropdown from "@/components/commons/dropdown/DropdownBase";

const FilterDropdown = ({
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

  const selectedCount = filterSet.size;

  const selectedOption = {
    label: selectedCount > 0 ? `${label} ${selectedCount}` : label,
    value: "",
  };

  const currentOption = Array.from(filterSet)[0] as string | undefined;

  return (
    <div className="flex flex-col items-start">
      <Dropdown
        id={label}
        selectedOption={selectedOption}
        options={options}
        currentOption={currentOption}
        handleChangeOption={(option: Option) =>
          handleFilterChange(category, option.value)
        }
      />
    </div>
  );
};

export default memo(FilterDropdown);
