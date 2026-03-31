"use client";

import { useState, useMemo, ChangeEvent, FormEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { ApiBrandSimpleResponse } from "@/server/hono/schemas/brand.schema";

export const usePerfumeSearchState = (
  brands: ApiBrandSimpleResponse[]
) => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q");

  const [inputValue, setInputValue] = useState(queryParam || "");
  const [searchKeyword, setSearchKeyword] = useState(queryParam || "");

  // URL의 query parameter가 변경되면 검색어 업데이트
  useEffect(() => {
    if (queryParam !== null) {
      setInputValue(queryParam);
      setSearchKeyword(queryParam);
    }
  }, [queryParam]);

  // 검색어 제출 핸들러
  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setSearchKeyword(inputValue.trim());
  };

  // 검색 입력 변경 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 검색어에 포함된 브랜드명을 찾는 로직
  const matchedBrand = useMemo(() => {
    if (!searchKeyword) return null;
    const keywordWords = searchKeyword.toLowerCase().split(" ");
    const match = brands.find((brand) =>
      keywordWords.includes(brand.nameEn.toLowerCase())
    );
    return match ? match.nameEn : null;
  }, [searchKeyword, brands]);

  const clearSearchKeyword = () => {
    setInputValue("");
    setSearchKeyword("");
  };

  return {
    inputValue,
    searchKeyword,
    matchedBrand,
    handleChange,
    handleSubmit,
    clearSearchKeyword,
  };
};
