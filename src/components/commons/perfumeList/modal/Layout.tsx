import { ReactNode } from "react";
// import { useTotalStore } from "@/client/stores/useCountStore";
import { ButtonFilledPrimaryLFull } from "@/components/commons/button/ButtonFilled";
import { ButtonOutlinedPrimaryLFull } from "@/components/commons/button/ButtonOutlined";
import { useFilterStore } from "@/client/stores/perfumeStore";
import { Indicator } from "../../loading/Indicator";

interface FilterModalLayoutProps {
  category?: string;
  title: string;
  note?: string;
  isLoading?: boolean;
  onReset: () => void;
  onSubmit: () => void;
  selectedSection?: ReactNode;
  availableSection?: ReactNode;
  children?: ReactNode;
}

export function FilterModalLayout({
  category,
  title,
  note,
  isLoading = false,
  onReset,
  onSubmit,
  selectedSection,
  availableSection,
  children,
}: FilterModalLayoutProps) {
  const pendingFilters = useFilterStore((state) => state.pendingFilters);

  // pending 기준으로 카운트 표시 (category가 있을 때만)
  const count = category ? pendingFilters[category]?.length ?? 0 : 0;

  // 새로운 섹션 분리 방식 사용
  const useSeparatedSections = selectedSection || availableSection;

  return (
    <section className="bg-white tablet:w-[640px] w-full px-5 pb-5 rounded-xl">
      <header className="flex items-center mb-5 gap-1">
        <h2 className="text-title-1 font-semibold">{title}</h2>
        {note && (
          <span className="text-gray-100 text-label-1 font-medium">{note}</span>
        )}
        {isLoading && (
          <div className="ml-2 flex items-center">
            <Indicator />
          </div>
        )}
      </header>

      {useSeparatedSections ? (
        <div className="max-h-[40vh] overflow-y-auto">
          {/* 선택된 필터 섹션 */}
          {selectedSection && (
            <div className="mb-4 transition-all duration-300 ease-in-out">
              <h3 className="text-label-1 font-semibold text-gray-100 mb-2">
                선택됨 ({count})
              </h3>
              <div className="flex flex-wrap gap-1 transition-all duration-200">
                {selectedSection}
              </div>
            </div>
          )}

          {/* 구분선 */}
          {selectedSection && availableSection && (
            <div className="border-t border-gray-50 my-4 transition-opacity duration-300" />
          )}

          {/* 선택 가능한 필터 섹션 */}
          {availableSection && (
            <div className="transition-all duration-300 ease-in-out">
              <h3 className="text-label-1 font-semibold text-gray-100 mb-2">
                선택 가능
              </h3>
              <div className="flex flex-wrap gap-1 transition-all duration-200">
                {availableSection}
              </div>
            </div>
          )}
        </div>
      ) : (
        // 기존 방식 (하위 호환성)
        <div className="flex flex-wrap gap-1 max-h-[40vh] overflow-y-auto">
          {children}
        </div>
      )}

      <footer className="flex gap-2 mt-5">
        <ButtonOutlinedPrimaryLFull onClick={onReset}>
          초기화
        </ButtonOutlinedPrimaryLFull>
        <ButtonFilledPrimaryLFull onClick={onSubmit}>
          {`${count}개 검색`}
        </ButtonFilledPrimaryLFull>
      </footer>
    </section>
  );
}
