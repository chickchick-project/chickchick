import React, { ChangeEvent, FormEvent } from "react";
import {
  ApiPerfumeAccordResponse,
  ApiPerfumeNoteResponse,
} from "@/server/hono/schemas/perfume.schema";
import type { ApiBrandSimpleResponse } from "@/server/hono/schemas/brand.schema";
import { SearchBar } from "@/components/commons/search/SearchBar";
import PerFumeFilter from "../filter";

interface SearchHeaderProps {
  inputValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e?: FormEvent) => void;
  brands?: ApiBrandSimpleResponse[];
  notes: ApiPerfumeNoteResponse[];
  accords: ApiPerfumeAccordResponse[];
  isSearch?: boolean;
  searchBarMaxWidth?: string;
}

export function SearchHeader({
  inputValue,
  onChange,
  onSubmit,
  brands,
  notes,
  accords,
  isSearch = true,
  searchBarMaxWidth = "840px",
}: SearchHeaderProps) {
  return (
    <header className="w-full px-4">
      <div className="flex flex-col items-center max-w-[1200px] mx-auto my-5">
        {isSearch && (
          <SearchBar
            value={inputValue}
            onChange={onChange}
            onClick={onSubmit}
            maxWidth={searchBarMaxWidth}
            maxLength={100}
          />
        )}
        <nav className="w-full mt-7">
          <PerFumeFilter
            brands={brands}
            notes={notes}
            accords={accords}
          />
        </nav>
      </div>
    </header>
  );
}
