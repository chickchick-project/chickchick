import React, { ChangeEvent, FormEvent } from "react";
import { brands, perfume_accords, perfume_notes } from "@prisma/client";
import { SearchBar } from "@/components/commons/search/SearchBar";
import PerFumeFilter from "@/components/domains/perfumes/filter";

interface SearchHeaderProps {
  inputValue: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e?: FormEvent) => void;
  brands: brands[];
  notes: perfume_notes[];
  accords: perfume_accords[];
}

export const SearchHeader = ({
  inputValue,
  onChange,
  onSubmit,
  brands,
  notes,
  accords,
}: SearchHeaderProps) => {
  return (
    <header className="w-full">
      <div className="flex flex-col items-center max-w-[1200px] mx-auto my-10">
        <SearchBar value={inputValue} onChange={onChange} onClick={onSubmit} />
        <nav className="w-full mt-7">
          <div className="flex justify-between">
            <PerFumeFilter brands={brands} notes={notes} accords={accords} />
          </div>
        </nav>
      </div>
    </header>
  );
};
