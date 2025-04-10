import { useEffect } from "react";
import { Option } from "@/lib/constants/options";
import { useVisibilityStore } from "@/lib/stores/useVisibilityStore";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { getLabel } from "@/components/domains/perfumes/perfumes.helpers";
import { ModalContainer } from "@/components/modal/ModalContainer";
import { FilterModalLayout } from "@/components/domains/perfumes/modal/Layout";

interface IFilterDropdownProps {
  id: string;
  options: Option[];
  currentOption?: string;
  handleChangeOption: (option: Option) => void;
}

export default function FilterItemModal({
  id,
  options,
  handleChangeOption,
}: IFilterDropdownProps) {
  const close = useVisibilityStore((state) => state.close);
  const resets = useFilterStore((state) => state.resetFilters);
  const filters = useFilterStore((state) => state.filters);
  const selectedSet = filters.get(id) ?? new Set();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <ModalContainer closeModal={() => close(id)}>
      <FilterModalLayout
        title={getLabel(id)}
        note="(중복 선택 가능)"
        onReset={resets}
        onSubmit={() => close(id)}
      >
        {options.map((option) => {
          const isSelectedOption = selectedSet.has(option.value);
          return (
            <button
              key={option.value}
              onClick={() => handleChangeOption(option)}
              className={`py-2 px-3 rounded-full border ${
                isSelectedOption
                  ? "text-white bg-primary-300 border-transparent"
                  : "text-black-100 border-gray-100"
              }`}
            >
              <span className="text-label-1 font-medium">{option.label}</span>
            </button>
          );
        })}
      </FilterModalLayout>
    </ModalContainer>
  );
}
