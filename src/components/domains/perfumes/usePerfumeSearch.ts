"use client";

import { useState, useMemo, ChangeEvent, FormEvent } from "react";
import { Brand } from "@prisma/client";

export const usePerfumeSearch = (brands: Brand[]) => {
  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

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

  return {
    inputValue,
    searchKeyword,
    matchedBrand,
    handleChange,
    handleSubmit,
  };
};
