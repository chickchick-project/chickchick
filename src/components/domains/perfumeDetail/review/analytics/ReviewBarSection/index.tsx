import React from "react";
import { BarChart } from "./BarChart";
import { countByCategory } from "../analytics.helpers";

export const ReviewBarSection = ({
  counts,
}: {
  counts: Record<number, Record<string, number>>;
}) => {
  const reviewBarChartData = [
    {
      title: "이미지",
      items: countByCategory(counts, "genderTone"),
    },
    {
      title: "계절",
      items: countByCategory(counts, "season"),
    },
    {
      title: "시간",
      items: countByCategory(counts, "timeOfDay"),
    },
  ];
  return (
    <section className="w-full p-9 pb-5 rounded-xl shadow-card">
      <ul className="grid grid-cols-2 gap-x-9 gap-y-5 w-full">
        {reviewBarChartData.map((block) => (
          <li key={block.title}>
            <BarChart title={block.title} data={block.items} />
          </li>
        ))}
      </ul>
    </section>
  );
};
