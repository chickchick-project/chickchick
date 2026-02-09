interface SearchResultsDropdownProps<T> {
  isLoading: boolean;
  results: T[];
  children: (item: T) => React.ReactNode;
}

export function SearchResultsDropdown<T extends { id: string }>({
  isLoading,
  results,
  children,
}: SearchResultsDropdownProps<T>) {
  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-s z-20 max-h-60 overflow-y-auto"
      role="region"
      aria-label="검색 결과"
    >
      {results.length > 0 ? (
        <ul>{results.map((item) => children(item))}</ul>
      ) : !isLoading ? (
        <div className="p-4 text-center text-black-200" role="status">
          검색 결과가 없습니다.
        </div>
      ) : null}
    </div>
  );
}
