"use client";

import { SearchBar } from "@/components/commons/search/SearchBar";
import { ReviewModal } from "@/components/modal/ReviewModal";
import { useState } from "react";

export const MainSearchBar = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-center items-center py-10">
      <SearchBar />
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        리뷰 모달
      </button>
      {open && (
        <ReviewModal
          closeModal={() => {
            setOpen(false);
          }}
        />
      )}
    </div>
  );
};
