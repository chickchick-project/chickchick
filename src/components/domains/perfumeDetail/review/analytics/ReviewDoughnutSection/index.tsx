import { DoughnutChart } from "./DoughnutChart";
import { countByCategory } from "../analytics.helpers";

export const ReviewDoughnutSection = ({
  counts,
}: {
  counts: Record<number, Record<string, number>>;
}) => {
  const doughnutChartData = [
    {
      category: "만족도",
      results: countByCategory(counts, "feeling"),
    },
    {
      category: "지속력",
      results: countByCategory(counts, "longevity"),
    },
    {
      category: "가격",
      results: countByCategory(counts, "pricePerception"),
    },
    {
      category: "잔향",
      results: countByCategory(counts, "sillage"),
    },
  ];
  return (
    <section className="w-full p-9 rounded-xl shadow-card">
      <ul className="grid grid-cols-[max-content_1fr] gap-x-9 gap-y-9 w-full">
        {doughnutChartData.map((item) => (
          <li key={item.category}>
            <DoughnutChart
              centerText={item.category}
              data={item.results.map((r) => ({
                label: r.label,
                value: r.count,
                color: r.color,
              }))}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
