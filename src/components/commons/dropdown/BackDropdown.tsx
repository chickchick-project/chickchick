import { useState, useEffect } from "react";
import Image from "next/image";
import ICONS from "@/lib/constants/icons";
import { Option } from "@/lib/constants/options";
import { useVisibilityStore } from "@/lib/stores/useVisibilityStore";
import { ModalContainer } from "@/components/modal/ModalContainer";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { FILTER_LABELS } from "@/components/domains/perfumes/filter/filter.constants";
import { ButtonFilledPrimaryLFull } from "../button/ButtonFilled";
import { ButtonOutlinedPrimaryLFull } from "../button/ButtonOutlined";
import DropdownButton from "./DropdownButton";
import { useTotalStore } from "@/lib/stores/useCountStore";

interface IFilterDropdownProps {
  id: string;
  selectedOption: Option;
  options: Option[];
  currentOption?: string;
  handleChangeOption: (option: Option) => void;
}

export default function BackDropdown({
  id,
  selectedOption,
  options,
  currentOption,
  handleChangeOption,
}: IFilterDropdownProps) {
  const [isSelected, setIsSelected] = useState(!!currentOption);
  const { isOpen, open, close } = useVisibilityStore();
  const { totalCount } = useTotalStore();

  const isOpenForId = isOpen(id);

  const arrowIcon = isSelected ? ICONS.ArrowDownPrimary : ICONS.ArrowDownGray;
  const resets = useFilterStore((state) => state.resetFilters);
  const filters = useFilterStore((state) => state.filters);
  const selectedSet = filters.get(id) ?? new Set();

  const handleSelectOption = (option: Option) => {
    handleChangeOption(option);
    setIsSelected(true);
  };

  useEffect(() => {
    setIsSelected(!!currentOption);
  }, [currentOption]);

  useEffect(() => {
    if (isOpenForId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpenForId]);

  return (
    <div className="relative inline-block">
      <DropdownButton
        onClick={() => open(id)}
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
      </DropdownButton>
      {isOpenForId && (
        <ModalContainer closeModal={() => close(id)}>
          <section className="bg-white w-[640px] p-5 border rounded-xl">
            <header className="flex items-center mb-5 gap-1">
              <h2 className="text-title-1 font-semibold">
                {FILTER_LABELS[id as keyof typeof FILTER_LABELS]}
              </h2>
              <span className="text-gray-100 text-label-1 font-medium">
                (중복 선택 가능)
              </span>
            </header>
            <div className="flex flex-wrap gap-1 max-h-[40vh] overflow-y-auto">
              {options.map((option) => {
                const isSelectedOption = selectedSet.has(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelectOption(option)}
                    className={`py-2 px-3 rounded-full border ${
                      isSelectedOption
                        ? "text-white bg-primary-300 border-transparent"
                        : "text-black-100 border-gray-100"
                    }`}
                  >
                    <span className="text-label-1 font-medium">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <footer className="flex gap-2 mt-5">
              <ButtonOutlinedPrimaryLFull onClick={() => resets()}>
                초기화
              </ButtonOutlinedPrimaryLFull>
              <ButtonFilledPrimaryLFull onClick={() => close(id)}>
                {totalCount}개 검색
              </ButtonFilledPrimaryLFull>
            </footer>
          </section>
        </ModalContainer>
      )}
    </div>
  );
}
