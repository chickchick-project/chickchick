import React from "react";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import Dropdown from "@/components/commons/dropdown/DropdownBase";

// 필터 옵션 정의(Mock)
export const FILTER_CONFIG = {
  gender: {
    label: "성별",
    options: [
      { label: "남성", value: "male" },
      { label: "여성", value: "female" },
    ],
  },
  brand: {
    label: "브랜드",
    options: [
      {
        label: "Dior",
        value: "2c88f47d-47b5-4127-bcce-c54400b52dd4",
      },
      {
        label: "Frederic Malle",
        value: "608b9ece-7c4c-487b-bfe8-5646ec35fc98",
      },
    ],
  },
  notes: {
    label: "노트",
    options: [
      { label: "Vanilla", value: "vanilla" },
      { label: "Lemon", value: "Lemon" },
    ],
  },
};

const typedKeys = <T extends Record<string, unknown>>(obj: T) =>
  Object.keys(obj) as (keyof T)[];

const PurFumeFilter = () => {
  const { filters, handleFilterChange, resetFilters } = useFilterStore();

  const getSelectedOption = (category: keyof typeof FILTER_CONFIG) => {
    const count = filters.get(category)?.size ?? 0;
    const baseLabel = FILTER_CONFIG[category].label;

    return {
      label: count > 0 ? `${baseLabel} ${count}` : baseLabel,
      value: "",
    };
  };
  return (
    <>
      <div className="flex gap-5">
        {/* 필터 버튼 렌더링 */}
        {typedKeys(FILTER_CONFIG).map((category) => {
          const { options } = FILTER_CONFIG[category];

          return (
            <div key={category} className="flex flex-col items-start">
              <Dropdown
                selectedOption={getSelectedOption(category)}
                options={options}
                currentOption={Array.from(filters.get(category) ?? [])[0]}
                handleChangeOption={(option) =>
                  handleFilterChange(category, option.value)
                }
              />
            </div>
          );
        })}
      </div>
      {/* 필터 목록 버튼 */}
      <button
        type="button"
        onClick={resetFilters}
        className="px-3 py-1 rounded border h-fit self-end"
      >
        필터 목록
      </button>
    </>
  );
};

export default PurFumeFilter;
