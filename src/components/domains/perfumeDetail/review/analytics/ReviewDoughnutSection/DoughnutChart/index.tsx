"use client";

import { Chart as ChartJS, ArcElement, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement);

type DoughnutChartProps = {
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
  centerText?: string;
};

export const DoughnutChart = ({ data, centerText }: DoughnutChartProps) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.color),
        hoverBackgroundColor: data.map((d) => d.color),
        borderWidth: 0,
        borderRadius: 50,
        spacing: 3,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    cutout: "80%",
  };

  return (
    <div className="flex gap-7 items-center">
      <div className="relative w-[120px] h-[120px]">
        <Doughnut data={chartData} options={options} />
        <h3 className="text-body-1 font-semibold text-black-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {centerText}
        </h3>
      </div>
      <ul className="flex flex-col gap-1">
        {data.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
            <span
              className="w-[9px] h-[9px] rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-black-100 text-label-2 font-medium">
              {item.label}
            </span>
            <span className="text-gray-100 text-label-3 font-medium">
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
