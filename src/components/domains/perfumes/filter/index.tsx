import React from "react";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import FilterDropdown from "./FilterDropdown";
import { brands, perfume_notes } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

const typedKeys = <T extends Record<string, unknown>>(obj: T) =>
  Object.keys(obj) as (keyof T)[];

const PerFumeFilter = ({
  brands,
  notes,
}: {
  brands: brands[];
  notes: perfume_notes[];
}) => {
  const { resetFilters } = useFilterStore();

  const toOption = (item: { id: string; name: JsonValue }) => ({
    label: (item.name as { en: string }).en,
    value: item.id,
  });

  const filterOptions = {
    brand: brands.map(toOption),
    notes: notes.map(toOption),
  };

  const LABELS = {
    brand: "브랜드",
    notes: "노트",
  };

  return (
    <>
      <div className="flex gap-5">
        {/* 필터 버튼 렌더링 */}
        {typedKeys(filterOptions).map((category) => (
          <FilterDropdown
            key={category}
            category={category}
            label={LABELS[category]}
            options={filterOptions[category]}
          />
        ))}
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

export default PerFumeFilter;
