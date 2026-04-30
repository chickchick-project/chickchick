import React, { useState } from "react";
import { X } from "lucide-react";
import { useSearchTag } from "./useSearchTag";
import type { ApiPerfumeSimpleResponse } from "@/server/hono/schemas/perfume.schema";
import Image from "next/image";

interface PerfumeTaggerProps {
  selectedPerfume: ApiPerfumeSimpleResponse | null;
  onSelectionChange: (perfume: ApiPerfumeSimpleResponse | null) => void;
}

export function PerfumeTagger({
  selectedPerfume,
  onSelectionChange,
}: PerfumeTaggerProps) {
  const [query, setQuery] = useState("");
  const hookOutput = useSearchTag(query);

  const {
    results: { data },
    isSearching,
  } = hookOutput;

  const handleAdd = (perfume: ApiPerfumeSimpleResponse) => {
    onSelectionChange(perfume);
    setQuery("");
  };

  const handleRemove = () => {
    onSelectionChange(null);
  };
  return (
    <div>
      <label
        htmlFor="perfume-search"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        향수 태그하기
      </label>
      <div className="relative">
        <input
          id="perfume-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="브랜드, 향수 이름 등으로 검색"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-200 focus:border-primary-200"
        />
        {query && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
            {isSearching && (
              <li className="px-4 py-2 text-gray-500">검색 중...</li>
            )}
            {!isSearching && (!data || data.length === 0) && (
              <li className="px-4 py-2 text-gray-500">검색 결과가 없습니다.</li>
            )}
            {data &&
              data.map((perfume) => {
                return (
                  <li
                    key={perfume.id}
                    onClick={() => handleAdd(perfume)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-primary-500 cursor-pointer transition-colors duration-150"
                  >
                    {/* 향수 이미지 */}
                    <Image
                      src={
                        perfume.perfumeImage?.imageUrl ||
                        "/placeholder-perfume.png"
                      }
                      alt={perfume.nameKo || ""}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-md flex-shrink-0 bg-gray-200"
                    />

                    {/* 텍스트 그룹 */}
                    <div className="overflow-hidden">
                      <p className="font-semibold text-primary-200 text-sm truncate">
                        <HighlightMatch
                          text={perfume.brand.nameKo!}
                          color="brand"
                          query={query}
                        />
                      </p>
                      <p className="text-black-100 text-xs truncate">
                        <HighlightMatch
                          text={perfume.nameKo!}
                          color="perfume"
                          query={query}
                        />
                      </p>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedPerfume && (
          <div
            key={selectedPerfume.id}
            className="flex items-center bg-primary-200 text-white text-sm font-medium pl-3 pr-2 py-1 rounded-full"
          >
            <span>{selectedPerfume.nameKo}</span>
            <button
              type="button"
              onClick={() => handleRemove()}
              className="ml-2 hover:text-red-500"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const HighlightMatch = ({
  text,
  color,
  query,
}: {
  text: string;
  color?: "brand" | "perfume";
  query: string;
}) => {
  if (!query) {
    return <span>{text}</span>;
  }
  // TODO: colorMap을 정의할 때 brand와 perfume를 구분할 수 있도록 수정
  const colorMap = {
    brand: "text-primary-500 font-bold",
    perfume: "text-primary-500 font-bold",
    default: "text-primary-500 font-bold",
  };

  const highlight = colorMap[color || "default"];

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <strong key={i} className={highlight}>
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </span>
  );
};
