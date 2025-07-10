import { SearchBar } from "@/components/commons/search/SearchBar";
import { ChangeEvent } from "react";

interface ISearchHeaderProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export function SearchHeader({
  value,
  onChange,
  onSubmit,
}: ISearchHeaderProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex justify-center w-full"
    >
      <SearchBar
        value={value}
        onChange={onChange}
        buttonType="submit"
        name="q"
        placeholder="community"
      />
    </form>
  );
}
