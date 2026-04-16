interface PerfumeErrorSectionProps {
  onRetry: () => void;
}

export function PerfumeErrorSection({ onRetry }: PerfumeErrorSectionProps) {
  return (
    <section className="flex flex-col h-full">
      <h3 className="tablet:text-headline-3 text-body-2 font-semibold">향수</h3>
      <div className="flex flex-col justify-center items-center flex-1 gap-3 py-20">
        <p className="text-body-1 text-gray-500">
          검색 중 문제가 발생했어요. 다시 시도해주세요.
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 text-label-1 rounded-lg border border-primary-300 text-primary-300 hover:bg-primary-50 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </section>
  );
}
