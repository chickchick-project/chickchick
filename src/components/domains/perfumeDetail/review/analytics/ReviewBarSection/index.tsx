import React from "react";
import { BarChart } from "./BarChart";
import { IReviewItem } from "@/lib/types/perfumeReview";

const CATEGORY_LABEL_MAP = {
  genderTone: [
    { key: "MASCULINE", label: "남성적인", color: "#6F4D3F" },
    { key: "UNISEX", label: "중성적인", color: "#A47764" },
    { key: "FEMININE", label: "여성적인", color: "#EAD8C4" },
  ],

  season: [
    { key: "WINTER", label: "겨울", color: "#6F4D3F" },
    { key: "AUTUMN", label: "가을", color: "#A47764" },
    { key: "SUMMER", label: "여름", color: "#DBC0B0" },
    { key: "SPRING", label: "봄", color: "#EAD8C4" },
  ],
  timeOfDay: [
    { key: "NIGHT", label: "밤", color: "#6F4D3F" },
    { key: "DAY", label: "낮", color: "#EAD8C4" },
  ],
};

type SeasonKey = "AUTUMN" | "SPRING" | "SUMMER" | "WINTER";

const reviewAnalytics = (data: IReviewItem[]) => {
  const countByCategory = (category: keyof typeof CATEGORY_LABEL_MAP) => {
    return CATEGORY_LABEL_MAP[category].map(({ key, label, color }) => {
      let count = 0;
      const typedKey = key as SeasonKey;
      data.forEach((r) => {
        const value = r.chips[category];
        if (category === "season") {
          if (value.includes(typedKey)) count++;
        } else {
          if (value === key) {
            count++;
          }
        }
      });
      return { label, count, color };
    });
  };

  return [
    {
      title: "이미지",
      items: countByCategory("genderTone"),
    },
    {
      title: "계절",
      items: countByCategory("season"),
    },
    {
      title: "시간",
      items: countByCategory("timeOfDay"),
    },
  ];
};

export const ReviewBarSection = ({ data }: { data: IReviewItem[] }) => {
  return (
    <section className="w-full p-9 pb-5 rounded-xl shadow-card">
      <ul className="grid grid-cols-2 gap-x-9 gap-y-5 w-full">
        {reviewAnalytics(data).map((block) => (
          <li key={block.title}>
            <BarChart title={block.title} data={block.items} />
          </li>
        ))}
      </ul>
    </section>
  );
};
