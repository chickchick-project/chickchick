import React from "react";
import Image from "next/image";
import { ModalContainer } from "@/components/modal/ModalContainer";
import { FilterModalLayout } from "./Layout";
import { getLabel } from "../perfumes.helpers";
import ICONS from "@/shared/constants/icons";
import { Option } from "@/shared/constants/options";

type FilterOptions = {
  gender: Option[];
  brand?: Option[];
  notes: Option[];
  accords: Option[];
};

interface ListModalProps {
  visible: boolean;
  close: () => void;
  filters: Record<string, string[]>;
  filterOptions: FilterOptions;
  closeFilter: (id: string) => void;
  resetFilters: () => void;
}

export default function ListModal({
  visible,
  close,
  filters,
  filterOptions,
  closeFilter,
  resetFilters,
}: ListModalProps) {
  if (!visible) return null;

  const visibleFilters = Object.entries(filters).filter(
    ([, value]) => value.length > 0
  );

  const getName = (key: keyof FilterOptions, id: string): string => {
    const options = filterOptions[key];
    return options?.find((opt) => opt.value === id)?.label ?? id;
  };

  return (
    <ModalContainer
      closeModal={close}
      className="w-full fixed bottom-0 left-0 rounded-t-xl rounded-b-none overflow-y-auto tablet:static tablet:w-auto tablet:rounded-xl"
      overlayClassName="items-end tablet:items-center"
    >
      <FilterModalLayout
        title={getLabel("list")}
        onReset={resetFilters}
        onSubmit={close}
      >
        <div className="flex flex-col w-full">
          {visibleFilters.map(([key, value], index) => {
            const typedKey = key as keyof FilterOptions;
            const isLast = index === visibleFilters.length - 1;
            return (
              <div
                key={key}
                className={`py-5 border-b border-gray-200 ${
                  isLast ? "border-none" : ""
                }`}
              >
                <h3 className="text-body-1 font-semibold">
                  {getLabel(typedKey)}
                </h3>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {[...value].map((id) => {
                    const name = getName(typedKey, id);
                    return (
                      <button
                        key={id}
                        type="button"
                        className="flex gap-1 p-2 border border-gray-100 rounded-full text-label-1 font-medium"
                        onClick={() => closeFilter(id)}
                      >
                        {name}
                        <Image
                          src={ICONS.Close.src}
                          alt={ICONS.Close.alt}
                          width={16}
                          height={16}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </FilterModalLayout>
    </ModalContainer>
  );
}
