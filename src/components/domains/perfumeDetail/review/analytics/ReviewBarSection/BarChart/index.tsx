"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartOptions,
  BarController,
  Plugin,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController);

type BarChartProps = {
  title: string;
  data: {
    label: string;
    count: number;
    color?: string | undefined;
  }[];
};

export const BarChart = ({ title, data }: BarChartProps) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: data.map((d) => d.color),
        hoverBackgroundColor: data.map((d) => d.color),
        borderRadius: 10,
        barThickness: 18,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 50,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#363636",
          font: {
            family: "Pretendard",
            size: 13,
          },
        },
      },
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "right",
        offset: 8,
        color: "#A8A8A8",
        font: {
          family: "Pretendard",
          size: 12,
        },
        formatter: (value: number) => value.toLocaleString(),
      },
    },
    animation: false,
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-black-200 font-semibold text-body-1">{title}</h3>
      <div className="w-full">
        <Chart
          type="bar"
          data={chartData}
          options={options}
          height={120}
          plugins={[ChartDataLabels as Plugin<"bar">]}
        />
      </div>
    </div>
  );
};
