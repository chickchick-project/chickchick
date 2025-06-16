"use client";

import { SearchBar } from "@/components/commons/search/SearchBar";

export const MainSearchBar = () => {
  return (
    <div className="flex justify-center items-center tablet:py-10 tablet:px-0 p-5">
      <SearchBar />
    </div>
  );
};
