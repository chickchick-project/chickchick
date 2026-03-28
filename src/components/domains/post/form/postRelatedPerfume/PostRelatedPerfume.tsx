import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import { ButtonFilledPrimaryLFit } from "@/components/commons/button/ButtonFilled";
import PerfumeCard from "@/components/commons/card/perfumeCard";
import { SearchResultsDropdown } from "@/components/commons/dropdown/SearchResultsDropdown";
import InputBase from "@/components/commons/input";
import type { PerfumeForPost } from "@/server/hono/schemas/community.schema";
import useDebounce from "@/client/hooks/useDebounce";
import useOnClickOutside from "@/client/hooks/useOnClickOutside";
import { useVisibilityStore } from "@/client/stores/uiStore";
import { searchApi } from "@/client/utils/api/search.api";

import SubTitleLabel from "../element/SubTitleLabel";
import PerfumeResultItem from "./PerfumeResultItem";
import usePerfumeSearch from "./usePerfumeSearch";

interface PostRelatedPerfumeProps {
  initialPerfumes?: PerfumeForPost[] | [];
}

export default function PostRelatedPerfume({
  initialPerfumes,
}: PostRelatedPerfumeProps) {
  const { setValue } = useFormContext();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    selectedPerfumes,

    tempSelectedPerfumeIds,
    handleToggleTempSelect,
    handleAddSelectedPerfumes,
    handleRemoveSelectedPerfume,
  } = usePerfumeSearch(initialPerfumes);

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [isLoading, setIsLoading] = useState(false);

  const dropdownId = "perfumeSearchDropdown";
  const { isOpen, open, close } = useVisibilityStore();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(searchContainerRef, () => close(dropdownId));

  const selectedPerfumesIds = useMemo(
    () => selectedPerfumes.map((p) => p.id),
    [selectedPerfumes],
  );
  const MAX_SELECTED_PERFUMES = 8;
  const isSelectedPerfumesLimit =
    selectedPerfumesIds.length + tempSelectedPerfumeIds.length >=
    MAX_SELECTED_PERFUMES;

  useEffect(() => {
    setValue("perfumeIds", selectedPerfumesIds);
    setValue("perfumes", selectedPerfumes);
  }, [setValue, selectedPerfumesIds, selectedPerfumes]);

  useEffect(() => {
    const fetchAndSetResults = async () => {
      if (debouncedSearchQuery.trim() === "") {
        setSearchResults([]);
        close(dropdownId);
        return;
      }
      setIsLoading(true);
      try {
        const response = await searchApi.perfumes({
          searchText: debouncedSearchQuery,
          limit: 50,
        });
        if (response && response.success && "data" in response) {
          setSearchResults(response.data.data);
        }
      } catch (error) {
        console.error("향수 검색 실패:", error);
        alert("향수를 불러오는 데 실패했습니다.");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
        open(dropdownId);
      }
    };

    fetchAndSetResults();
  }, [debouncedSearchQuery, close, open, dropdownId, setSearchResults]);

  return (
    <>
      <SubTitleLabel label="향수" htmlFor="perfume" />
      <section>
        <div className="flex gap-2 ">
          <div className="relative w-[500px]" ref={searchContainerRef}>
            <InputBase
              id="perfume"
              name="perfume"
              maxWidth="500px"
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery) open(dropdownId);
              }}
              value={searchQuery}
              isError={false}
              helperText="글 내용과 관련된 향수를 태그해 주세요. (최대 8개)"
              placeholder="향수명을 입력해주세요."
            />

            {isOpen(dropdownId) && (
              <SearchResultsDropdown
                isLoading={isLoading}
                results={searchResults}
              >
                {(perfume) => {
                  const isTempSelected = tempSelectedPerfumeIds.includes(
                    perfume.id,
                  );
                  const isSelected = selectedPerfumesIds.includes(perfume.id);
                  return (
                    <PerfumeResultItem
                      key={perfume.id}
                      perfume={perfume}
                      onToggle={handleToggleTempSelect}
                      isTempSelected={isTempSelected}
                      isSelected={isSelected}
                      isDisabled={
                        isSelectedPerfumesLimit &&
                        !isTempSelected &&
                        !isSelected
                      }
                    />
                  );
                }}
              </SearchResultsDropdown>
            )}
          </div>
          <ButtonFilledPrimaryLFit
            type="button"
            colorNum="200"
            disabled={tempSelectedPerfumeIds.length === 0}
            onClick={() => {
              handleAddSelectedPerfumes();
              close(dropdownId);
            }}
          >
            <p className="hidden tablet:block tablet:mr-1">+</p> 추가하기
          </ButtonFilledPrimaryLFit>
        </div>
        {selectedPerfumes.length > 0 && (
          <div className="mt-5 bg-gray-300 py-7 px-5 tablet:p-5 rounded-xl grid grid-cols-2 tablet:grid-cols-4 gap-5 w-full tablet:w-fit h-fit place-items-center">
            {selectedPerfumes.map((perfume) => (
              <PerfumeCard
                key={perfume.id}
                cardType="closable"
                perfumeImage={perfume.perfumeImage?.imageUrl ?? null}
                perfumeName={perfume.nameKo || perfume.nameEn}
                brandName={perfume.brand.nameKo || perfume.brand.nameEn}
                onClose={() => handleRemoveSelectedPerfume(perfume.id)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
