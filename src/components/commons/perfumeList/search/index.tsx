import React, { ChangeEvent, FormEvent } from "react";
import { Brand, PerfumeAccord, PerfumeNote } from "@prisma/client";
import { SearchBar } from "@/components/commons/search/SearchBar";
import PerFumeFilter from "../filter";

interface SearchHeaderProps {
  inputValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e?: FormEvent) => void;
  brands?: Brand[];
  notes: PerfumeNote[];
  accords: PerfumeAccord[];
  isSearch?: boolean;
}

export function SearchHeader({
  inputValue,
  onChange,
  onSubmit,
  brands,
  notes,
  accords,
  isSearch = true,
}: SearchHeaderProps) {
  return (
    <header className="w-full px-4">
      <div className="flex flex-col items-center max-w-[1200px] mx-auto my-5">
        {isSearch && (
          <SearchBar
            value={inputValue}
            onChange={onChange}
            onClick={onSubmit}
          />
        )}
        <nav className="w-full mt-7">
          <PerFumeFilter brands={brands} notes={notes} accords={accords} />
        </nav>
      </div>
    </header>
  );
}
