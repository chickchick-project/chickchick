import { useEffect, useMemo } from "react";
import { Option } from "@/lib/constants/options";
import { useVisibilityStore } from "@/lib/stores/useVisibilityStore";
import { useFilterStore } from "@/lib/stores/useFilterStore";
import { ModalContainer } from "@/components/modal/ModalContainer";
import { FilterModalLayout } from "./Layout";
import { getLabel } from "../perfumes.helpers";
import { useAvailableFilters } from "@/lib/hooks/query/useFilterQuery";

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
  const resetPending = useFilterStore((state) => state.resetPending);
  const commitFilters = useFilterStore((state) => state.commitFilters);
  const initializePending = useFilterStore((state) => state.initializePending);
  const pendingFilters = useFilterStore((state) => state.pendingFilters);

  // 모달 열릴 때 pending을 committed로 초기화 (한 번만 실행)
  useEffect(() => {
    initializePending();

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [initializePending]);

  // pending 필터 기준으로 가능한 필터 조회 (실시간 업데이트)
  const filterParams = useMemo(() => {
    return {
      searchText: "", // 검색어는 일단 빈 문자열 (필요시 추가 가능)
      brandFilter: pendingFilters.brand,
      notesFilter: pendingFilters.notes,
      accordsFilter: pendingFilters.accords,
    };
  }, [pendingFilters]);

  const {
    data: availableFilters,
    isLoading: isLoadingAvailable,
    isFetching: isFetchingAvailable,
  } = useAvailableFilters(filterParams, true);

  // 로딩 상태: 최초 로딩 또는 refetch 중
  const isFilterLoading = isLoadingAvailable || isFetchingAvailable;
  // 현재 카테고리의 가능한 옵션 ID 목록 (availableFilters 기준)
  const availableIds = useMemo(() => {
    if (!availableFilters) return new Set<string>();

    // 카테고리별로 가능한 ID 추출
    const categoryMap: Record<string, string[]> = {
      brand: [], // 브랜드는 빈 배열 (모든 브랜드 활성화)
      notes: availableFilters.notes?.map((n) => n.id) ?? [],
      accords: availableFilters.accords?.map((a) => a.id) ?? [],
    };

    return new Set(categoryMap[id] ?? []);
  }, [availableFilters, id]);

  // 옵션을 선택됨/선택 가능/비활성화로 분류
  const { selectedOptions, availableOptions, disabledOptions } = useMemo(() => {
    const selectedSet = pendingFilters[id] ?? [];
    const selected: Option[] = [];
    const available: Option[] = [];
    const disabled: Option[] = [];

    // pending이 비어있으면 (아무것도 선택 안 함) 모든 옵션 활성화
    const hasPendingFilters = Object.keys(pendingFilters).length > 0;

    const isBrandCategory = id === "brand";

    options.forEach((option) => {
      const isSelected = selectedSet.includes(option.value);
      const isAvailable = availableIds.has(option.value);

      if (isSelected) {
        selected.push(option);
      } else if (
        isBrandCategory || // 브랜드는 항상 활성화
        !hasPendingFilters ||
        isAvailable
      ) {
        // pending이 없거나, 가능한 옵션이면 활성화
        available.push(option);
      } else {
        // pending이 있는데 가능하지 않으면 비활성화
        disabled.push(option);
      }
    });

    return {
      selectedOptions: selected,
      availableOptions: available,
      disabledOptions: disabled,
    };
  }, [options, pendingFilters, id, availableIds]);

  // 필터 버튼 렌더링 함수
  const renderFilterButton = (
    option: Option,
    isSelected: boolean,
    isDisabled: boolean = false
  ) => (
    <button
      key={option.value}
      onClick={() => !isDisabled && handleChangeOption(option)}
      disabled={isDisabled}
      className={`py-2 px-3 rounded-full border transition-all duration-200 ease-in-out
        animate-fade-in
        ${
          isSelected
            ? "text-white bg-primary-300 border-transparent"
            : isDisabled
            ? "text-gray-100 bg-gray-50 border-gray-50 cursor-not-allowed opacity-50"
            : "text-black-100 border-gray-100 hover:border-primary-200 cursor-pointer"
        }`}
    >
      <span className="text-label-1 font-medium">
        {option.label}
        {isDisabled}
      </span>
    </button>
  );

  const handleSubmit = () => {
    commitFilters(id); // pending → committed
    close(id);
  };

  const handleReset = () => {
    resetPending(); // pending 전체 초기화
  };

  return (
    <ModalContainer
      closeModal={() => close(id)}
      className="w-full fixed bottom-0 left-0 rounded-t-xl rounded-b-none overflow-y-auto tablet:static tablet:w-auto tablet:rounded-xl"
      overlayClassName="items-end tablet:items-center"
    >
      <FilterModalLayout
        category={id}
        title={getLabel(id)}
        note="(중복 선택 가능)"
        isLoading={isFilterLoading}
        onReset={handleReset}
        onSubmit={handleSubmit}
        selectedSection={
          selectedOptions.length > 0
            ? selectedOptions.map((option) => renderFilterButton(option, true))
            : undefined
        }
        availableSection={
          <>
            {availableOptions.map((option) =>
              renderFilterButton(option, false, false)
            )}
            {disabledOptions.map((option) =>
              renderFilterButton(option, false, true)
            )}
          </>
        }
      />
    </ModalContainer>
  );
}
