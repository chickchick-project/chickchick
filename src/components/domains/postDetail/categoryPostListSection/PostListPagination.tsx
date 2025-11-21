import clsx from "clsx";

interface IPostListPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function PostListPagination({
  totalPages,
  currentPage,
  onPageChange,
}: IPostListPaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-5">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={clsx(
            "w-8 h-8 flex items-center justify-center rounded text-sm transition-colors",
            currentPage === page
              ? "bg-gray-200 text-black font-bold"
              : "text-gray-500 hover:bg-gray-100"
          )}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
