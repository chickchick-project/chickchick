"use client";

import React, { useMemo, useState } from "react";
import { countByCategory, type Counts } from "../analytics.helpers";
import type { ReviewCategory } from "@/lib/types/review.types";

export type BarDatum = { label: string; value: number };
export type Block = {
  title: string;
  category: ReviewCategory;
  results: BarDatum[];
};

const MOBILE_CATEGORIES: ReviewCategory[] = [
  "feeling",
  "longevity",
  "pricePerception",
  "sillage",
  "genderTone",
  "season",
  "timeOfDay",
];

/** 타이틀 매핑 */
const TITLE_MAP: Record<ReviewCategory, string> = {
  feeling: "만족도",
  longevity: "지속력",
  pricePerception: "가격",
  sillage: "잔향",
  genderTone: "이미지",
  season: "계절",
  timeOfDay: "시간",
};

/* -------------------- 라벨 포맷터 -------------------- */

function normLongevity(
  label: string
): "LONG" | "MODERATE" | "WEAK" | "VERY_WEAK" | null {
  const s = label.trim();

  if (s === "긴 지속력 (6시간 이상)") return "LONG";
  if (s === "중간 (3-6시간)") return "MODERATE";
  if (s === "짧음 (1-3시간)") return "WEAK";
  if (s === "매우 짧음 (1시간 미만)") return "VERY_WEAK";

  return null;
}
function normSillage(label: string): "STRONG" | "MODERATE" | "INTIMATE" | null {
  const s = label.trim();

  if (s === "주변 사람들이 쉽게 느낄 수 있는 정도") return "STRONG";
  if (s === "가까이 있는 사람이 느낄 수 있는 정도") return "MODERATE";
  if (s === "자신만 느낄 수 있는 정도") return "INTIMATE";
  return null;
}

function formatLongevity(label: string): string {
  switch (normLongevity(label)) {
    case "LONG":
      return "긴 지속력 (6h)";
    case "MODERATE":
      return "중간 (3-6h)";
    case "WEAK":
      return "짧음 (1-3h)";
    case "VERY_WEAK":
      return "매우 짧음 (1h)";
    default:
      return label;
  }
}
function formatSillage(label: string): string {
  switch (normSillage(label)) {
    case "STRONG":
      return "멀리 퍼지는 향";
    case "MODERATE":
      return "주변만 퍼지는 향";
    case "INTIMATE":
      return "자기만 느끼는 향";
    default:
      return label;
  }
}

function formatLabel(category: ReviewCategory, label: string): string {
  if (category === "longevity") return formatLongevity(label);
  if (category === "sillage") return formatSillage(label);
  return label;
}

/* -------------------- UI -------------------- */

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
  category,
  data,
  winners,
}: {
  category: ReviewCategory;
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
              {formatLabel(category, d.label)}
            </div>

            <div className="h-2 w-full rounded-full bg-gray-300">
              <div
                className={`h-2 rounded-full transition-[width] duration-300 ${
                  isWinner ? "bg-secondary" : "bg-gray-200"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>

            <span
              className={`tabular-nums text-label-3 w-[31px] text-right ${
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
          <span className="text-label-1 text-black-100">
            {formatLabel(block.category, winnerTop.label)}
          </span>
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
          <MobileBarChart
            category={block.category}
            data={block.results}
            winners={winnersSet}
          />
        </div>
      )}
    </li>
  );
}

export default function ReviewMobileSection({ counts }: { counts: Counts }) {
  const blocks: Block[] = useMemo(() => {
    return MOBILE_CATEGORIES.map((cat) => {
      const rows = countByCategory(counts, cat);
      return {
        title: TITLE_MAP[cat],
        category: cat,
        results: rows.map((r) => ({ label: r.label, value: r.count })),
      };
    });
  }, [counts]);

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
