import type { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";

import { useState } from "react";

export default function usePerfumeSearch(
  initialPerfumes?: ApiPerfumeSimpleResponse[]
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    ApiPerfumeSimpleResponse[]
  >([]);

  const [tempSelectedPerfumeIds, setTempSelectedPerfumesIds] = useState<
    string[]
  >([]);
  const [selectedPerfumes, setSelectedPerfumes] = useState<
    ApiPerfumeSimpleResponse[]
  >(initialPerfumes || []);

  const handleToggleTempSelect = (perfume: ApiPerfumeSimpleResponse) => {
    setTempSelectedPerfumesIds((prev) => {
      if (prev.includes(perfume.id)) {
        return prev.filter((id) => id !== perfume.id);
      } else {
        return [...prev, perfume.id];
      }
    });
  };

  const handleAddSelectedPerfumes = () => {
    const newPerfumesToAdd = searchResults.filter((perfume) =>
      tempSelectedPerfumeIds.includes(perfume.id)
    );
    setSelectedPerfumes((prev) => {
      const existingIds = prev.map((p) => p.id);
      const filteredNewPerfumes = newPerfumesToAdd.filter(
        (p) => !existingIds.includes(p.id)
      );

      return [...prev, ...filteredNewPerfumes];
    });

    setSearchQuery("");
    setSearchResults([]);
    setTempSelectedPerfumesIds([]);
  };

  const handleRemoveSelectedPerfume = (perfumeId: string) => {
    setSelectedPerfumes((prev) =>
      prev.filter((perfume) => perfume.id !== perfumeId)
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    selectedPerfumes,
    tempSelectedPerfumeIds,
    handleToggleTempSelect,
    handleAddSelectedPerfumes,
    handleRemoveSelectedPerfume,
  };
}
