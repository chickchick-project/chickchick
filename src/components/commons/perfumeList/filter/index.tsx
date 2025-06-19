import React, { useMemo } from "react";
import FilterItem from "./FilterItem";
import { Brand, PerfumeAccord, PerfumeNote } from "@prisma/client";
import { GENDER_OPTIONS } from "./filter.constants";
import { getLabel } from "../perfumes.helpers";
import { toOption, typedKeys } from "./filter.helper";
import FilterList from "./FilterList";
import { usePathname } from "next/navigation";

export default function PerFumeFilter({
  brands,
  notes,
  accords,
}: {
  brands?: Brand[];
  notes: PerfumeNote[];
  accords: PerfumeAccord[];
}) {
  const pathname = usePathname();
  const isBrandPage = pathname.includes("brand");

  const filterOptions = useMemo(
    () => ({
      gender: GENDER_OPTIONS.map(toOption),
      ...(!isBrandPage && {
        brand: brands?.map((item) => ({
          label: item.nameKo ?? item.nameEn,
          value: item.id,
        })),
      }),
      notes: notes.map((item) => ({
        label: item.nameKo ?? item.nameEn,
        value: item.id,
      })),
      accords: accords.map((item) => ({
        label: item.nameKo ?? item.nameEn,
        value: item.id,
      })),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [brands, notes, accords]
  );

  return (
    <div className="flex justify-between">
      <div className="flex tablet:gap-5 gap-2">
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
