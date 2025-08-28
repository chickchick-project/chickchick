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
    <div className="absolute top-full left-0 right-0 -mt-5 bg-white border border-gray-200 rounded-lg shadow-s z-20 max-h-60 overflow-y-auto">
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">검색 중...</div>
      ) : results.length > 0 ? (
        <ul>{results.map((item) => children(item))}</ul>
      ) : (
        <div className="p-4 text-center text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
