import { useState } from "react";

export const useFilters = () => {
  const [filters, setFilters] = useState<Map<string, Set<string>>>(new Map());

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters((prevFilters) => {
      const newFilters = new Map(prevFilters);
      const currentSet = new Set(newFilters.get(key) ?? []);

      const updatedSet = new Set(currentSet);

      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (updatedSet.has(v)) {
            updatedSet.delete(v);
          } else {
            updatedSet.add(v);
          }
        });
      } else {
        if (updatedSet.has(value)) {
          updatedSet.delete(value);
        } else {
          updatedSet.add(value);
        }
      }

      newFilters.set(key, updatedSet);

      return newFilters;
    });
  };

  const resetFilters = () => setFilters(new Map());

  return { filters, handleFilterChange, resetFilters };
};
