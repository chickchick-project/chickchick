"use client";

import { SearchBar } from "@/components/commons/search/SearchBar";
import { useRouter } from "next/navigation";
import { useSearchBar } from "@/lib/hooks/useSearchBar";
import { useEffect, useState, useRef } from "react";
import useDebounce from "@/lib/hooks/useDebounce";
import { searchApi } from "@/lib/utils/api/search.api";
import { SearchResultsDropdown } from "@/components/commons/dropdown/SearchResultsDropdown";
import useOnClickOutside from "@/lib/hooks/useOnClickOutside";
import { useVisibilityStore } from "@/lib/stores/useVisibilityStore";
import Image from "next/image";
import ICONS from "@/lib/constants/icons";
import { highlightText } from "@/lib/utils/highlightText";

interface PerfumeSearchResult {
  id: string;
  nameKo: string | null;
  nameEn: string;
  brand: {
    nameKo: string | null;
    nameEn: string;
  };
  perfumeImage: {
    imageUrl: string;
  } | null;
}

export const MainSearchBar = () => {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<PerfumeSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const dropdownId = "mainSearchDropdown";
  const { isOpen, open, close } = useVisibilityStore();
  useOnClickOutside(searchContainerRef, () => close(dropdownId));

  const { value, handleChange, handleSubmit } = useSearchBar({
    onSearch: (searchTerm) => {
      close(dropdownId);
      if (searchTerm) {
        router.push(`/perfumes?q=${encodeURIComponent(searchTerm)}`);
      } else {
        router.push("/perfumes");
      }
    },
  });

  const debouncedSearchQuery = useDebounce(value, 500);

  // 디바운싱 중인지 확인
  useEffect(() => {
    if (value.trim() !== "" && value !== debouncedSearchQuery) {
      setIsLoading(true);
    }
  }, [value, debouncedSearchQuery]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchQuery.trim() === "") {
        setSearchResults([]);
        close(dropdownId);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await searchApi.perfumes({
          searchText: debouncedSearchQuery,
          limit: 10,
        });
        if (response && response.success && "data" in response) {
          setSearchResults(response.data.data);
          open(dropdownId);
        }
      } catch (error) {
        console.error("향수 검색 실패:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery, close, open, dropdownId]);

  const handleResultClick = (perfumeId: string) => {
    close(dropdownId);
    router.push(`/perfumes/${perfumeId}`);
  };

  return (
    <div className="flex justify-center items-center tablet:py-10 tablet:px-0 p-5">
      <form onSubmit={handleSubmit} className="w-full max-w-[840px]">
        <div ref={searchContainerRef} className="relative w-full">
          <SearchBar
            value={value}
            onChange={handleChange}
            onClick={handleSubmit}
            buttonType="submit"
            maxWidth="100%"
            isLoading={isLoading}
            onFocus={() => {
              if (value && searchResults.length > 0) open(dropdownId);
            }}
          />

          {isOpen(dropdownId) && (
            <SearchResultsDropdown
              isLoading={isLoading}
              results={searchResults}
            >
              {(perfume) => (
                <li
                  key={perfume.id}
                  onClick={() => handleResultClick(perfume.id)}
                  className="flex items-center gap-3 p-3 hover:bg-primary-500 cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 relative flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                    {perfume.perfumeImage?.imageUrl ? (
                      <Image
                        src={perfume.perfumeImage.imageUrl}
                        alt={perfume.nameKo || perfume.nameEn}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image
                          src={ICONS.Logo.src}
                          alt="No image"
                          width={24}
                          height={24}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-body-2 font-medium text-black-100">
                      {highlightText(
                        perfume.nameKo || perfume.nameEn,
                        debouncedSearchQuery,
                      )}
                    </span>
                    <span className="text-label-2 text-gray-500">
                      {highlightText(
                        perfume.brand.nameKo || perfume.brand.nameEn,
                        debouncedSearchQuery,
                      )}
                    </span>
                  </div>
                </li>
              )}
            </SearchResultsDropdown>
          )}
        </div>
      </form>
    </div>
  );
};
