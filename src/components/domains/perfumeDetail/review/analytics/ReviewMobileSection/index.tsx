import { IReviewItem } from "@/lib/types/perfumeReview";
import React, { useMemo, useState } from "react";

const CATEGORY_LABEL_MAP = {
  feeling: [
    { key: "BEST", label: "최고예요" },
    { key: "GOOD", label: "좋아요" },
    { key: "NEUTRAL", label: "괜찮아요" },
    { key: "BAD", label: "별로예요" },
    { key: "DISLIKE", label: "싫어요" },
  ],
  longevity: [
    { key: "LONG_LASTING", label: "긴 지속력" },
    { key: "MODERATE", label: "중간" },
    { key: "WEAK", label: "짧음" },
    { key: "VERY_WEAK", label: "매우 짧음" },
  ],
  pricePerception: [
    { key: "GOOD_VALUE", label: "가성비가 좋아요" },
    { key: "REASONABLE", label: "적당해요" },
    { key: "EXPENSIVE", label: "비싸요" },
  ],
  sillage: [
    { key: "STRONG", label: "멀리 퍼지는 향" },
    { key: "MODERATE", label: "주변만 퍼지는 향" },
    { key: "INTIMATE", label: "자기만 느끼는 향" },
  ],
  genderTone: [
    { key: "MASCULINE", label: "남성적인" },
    { key: "UNISEX", label: "중성적인" },
    { key: "FEMININE", label: "여성적인" },
  ],
  season: [
    { key: "WINTER", label: "겨울" },
    { key: "AUTUMN", label: "가을" },
    { key: "SUMMER", label: "여름" },
    { key: "SPRING", label: "봄" },
  ],
  timeOfDay: [
    { key: "NIGHT", label: "밤" },
    { key: "DAY", label: "낮" },
  ],
} as const;

export type BarDatum = { label: string; value: number };
export type Block = { title: string; results: BarDatum[] };

const reviewAnalytics = (data: IReviewItem[]): Block[] => {
  const countByCategory = (
    category: keyof typeof CATEGORY_LABEL_MAP
  ): BarDatum[] => {
    return CATEGORY_LABEL_MAP[category].map(({ key, label }) => ({
      label,
      value: data.filter((r) => r.chips[category] === key).length,
    }));
  };

  return [
    { title: "만족도", results: countByCategory("feeling") },
    { title: "지속력", results: countByCategory("longevity") },
    { title: "가격", results: countByCategory("pricePerception") },
    { title: "잔향", results: countByCategory("sillage") },
    { title: "이미지", results: countByCategory("genderTone") },
    { title: "계절", results: countByCategory("season") },
    { title: "시간", results: countByCategory("timeOfDay") },
  ];
};

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`h-5 w-5 transition-transform ${
        open ? "-rotate-180" : "rotate-0"
      }`}
    >
      <path
        d="M7 10l5 5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Winners = Set<BarDatum["label"]>;

function MobileBarChart({
  data,
  winners,
}: {
  data: BarDatum[];
  winners?: Winners;
}) {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;

  return (
    <div className="mt-4 flex flex-col gap-3">
      {data.map((d) => {
        const pct = (d.value / total) * 100;
        const isWinner = winners?.has(d.label) ?? false;

        return (
          <div
            key={d.label}
            className={`flex gap-3 items-center ${
              isWinner ? "text-black-100" : ""
            }`}
            data-winner={isWinner ? "true" : "false"}
          >
            <div
              className={`flex items-center justify-between w-[79px] text-label-3 font-medium whitespace-nowrap shrink-0
                ${isWinner ? "text-black-100" : "text-gray-100"}`}
            >
              {d.label}
            </div>

            <div className="h-2 w-full rounded-full bg-gray-300">
              <div
                className={`h-2 rounded-full transition-[width] duration-300
                  ${isWinner ? "bg-secondary" : "bg-gray-200"}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <span
              className={`tabular-nums text-label-3 w-[31px] text-right
                ${
                  isWinner
                    ? "font-semibold text-black-100"
                    : "font-medium text-gray-100"
                }`}
            >
              {d.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MobileAnalyticsBlock({ block }: { block: Block }) {
  const [open, setOpen] = useState(true);

  const { winnersSet, winnerTop } = useMemo(() => {
    const max = Math.max(0, ...block.results.map((r) => r.value));
    const winners = block.results.filter((r) => r.value === max && max > 0);
    return {
      winnersSet: new Set(winners.map((w) => w.label)),
      winnerTop: winners[0],
    };
  }, [block]);

  return (
    <li className="rounded-xl bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3"
      >
        <span className="shrink-0 rounded-md border border-black-100 px-3 py-2 text-label-1 font-medium text-black-100 w-[61px] whitespace-nowrap">
          {block.title}
        </span>

        {winnerTop && (
          <span className="text-label-1 text-black-100">{winnerTop.label}</span>
        )}

        <span className="h-[1px] grow border-b border-dashed border-gray-200" />

        <div className="flex gap-1">
          {winnerTop && (
            <span className="shrink-0 tabular-nums text-label-1 font-medium text-black-100">
              {winnerTop.value}
            </span>
          )}
          <Caret open={open} />
        </div>
      </button>

      {open && (
        <div className="px-2">
          <MobileBarChart data={block.results} winners={winnersSet} />
        </div>
      )}
    </li>
  );
}

export default function ReviewMobileSection({ data }: { data: IReviewItem[] }) {
  const blocks = useMemo(() => reviewAnalytics(data), [data]);

  return (
    <section>
      <ul className="flex flex-col gap-[18px] px-4">
        {blocks.map((block) => (
          <MobileAnalyticsBlock key={block.title} block={block} />
        ))}
      </ul>
    </section>
  );
}
