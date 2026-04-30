"use client";

import { useState, ChangeEvent, FormEvent } from "react";

interface UseSearchBarOptions {
  initialValue?: string;
  onSearch?: (searchTerm: string) => void;
}

export function useSearchBar({ initialValue = "", onSearch }: UseSearchBarOptions = {}) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmedValue = value.trim();
    if (onSearch) {
      onSearch(trimmedValue);
    }
  };

  const reset = () => {
    setValue("");
  };

  return {
    value,
    setValue,
    handleChange,
    handleSubmit,
    reset,
  };
}
