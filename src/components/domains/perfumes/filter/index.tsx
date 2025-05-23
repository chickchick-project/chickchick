import React, { useMemo } from "react";
import FilterItem from "./FilterItem";
import { brands, perfume_accords, perfume_notes } from "@prisma/client";
import { GENDER_OPTIONS } from "./filter.constants";
import { getLabel } from "../perfumes.helpers";
import { toOption, typedKeys } from "./filter.helper";
import FilterList from "./FilterList";

export default function PerFumeFilter({
  brands,
  notes,
  accords,
  isBrandPage = false,
}: {
  brands?: brands[];
  notes: perfume_notes[];
  accords: perfume_accords[];
  isBrandPage?: boolean;
}) {
  const filterOptions = useMemo(
    () => ({
      gender: GENDER_OPTIONS.map(toOption),
      ...(!isBrandPage && { brand: brands?.map(toOption) }),
      notes: notes.map(toOption),
      accords: accords.map(toOption),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [brands, notes, accords]
  );

  return (
    <div className="flex justify-between">
      <div className="flex gap-5">
        {/* 필터 버튼 렌더링 */}
        {typedKeys(filterOptions).map((category) => (
          <FilterItem
            key={category}
            category={category}
            label={getLabel(category)}
            options={filterOptions[category] ?? []}
          />
        ))}
      </div>
      {/* 필터 목록 버튼 */}
      <FilterList filterOptions={filterOptions} />
    </div>
  );
}
