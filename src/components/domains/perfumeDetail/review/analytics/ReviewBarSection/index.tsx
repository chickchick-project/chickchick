import React from "react";
import { BarChart } from "./BarChart";

export const ReviewBarSection = () => {
  const mockData = [
    {
      title: "이미지",
      items: [
        { label: "남성적인", value: 1, color: "#6F4D3F" },
        { label: "중성적인", value: 2, color: "#A47764" },
        { label: "여성적인", value: 3, color: "#EAD8C4" },
      ],
    },
    {
      title: "연령",
      items: [
        { label: "모든 연령대", value: 1000, color: "#6F4D3F" },
        { label: "성숙한 층", value: 181, color: "#A47764" },
        { label: "젊은 층", value: 51, color: "#EAD8C4" },
      ],
    },
    {
      title: "계절",
      items: [
        { label: "겨울", value: 1, color: "#6F4D3F" },
        { label: "가을", value: 2, color: "#A47764" },
        { label: "여름", value: 3, color: "#DBC0B0" },
        { label: "봄", value: 4, color: "#EAD8C4" },
      ],
    },
    {
      title: "시간",
      items: [
        { label: "밤", value: 500, color: "#6F4D3F" },
        { label: "낮", value: 51, color: "#EAD8C4" },
      ],
    },
  ];

  return (
    <section className="w-full p-9 pb-5 rounded-xl shadow-card">
      <ul className="grid grid-cols-2 gap-x-9 gap-y-5 w-full">
        {mockData.map((block) => (
          <li key={block.title}>
            <BarChart title={block.title} data={block.items} />
          </li>
        ))}
      </ul>
    </section>
  );
};
