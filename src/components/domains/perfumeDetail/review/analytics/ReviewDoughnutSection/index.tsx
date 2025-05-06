import { DoughnutChart } from "./DoughnutChart";

const mockApiResponse = [
  {
    category: "만족도",
    results: [
      { label: "최고예요", count: 87, color: "#6F4D3F" },
      { label: "좋아요", count: 65, color: "#A47764" },
      { label: "괜찮아요", count: 112, color: "#CB9C88" },
      { label: "별로예요", count: 29, color: "#DBC0B0" },
      { label: "싫어요", count: 43, color: "#EAD8C4" },
    ],
  },
  {
    category: "지속력",
    results: [
      { label: "긴 지속력 (6시간 이상)", count: 41, color: "#6F4D3F" },
      { label: "중간 (3-6시간)", count: 78, color: "#A47764" },
      { label: "짧음 (1-3시간)", count: 196, color: "#CB9C88" },
      { label: "매우 짧음 (1시간 미만)", count: 65, color: "#EAD8C4" },
    ],
  },
  {
    category: "가격",
    results: [
      { label: "가성비가 좋아요", count: 82, color: "#6F4D3F" },
      { label: "적당해요", count: 103, color: "#CB9C88" },
      { label: "비싸요", count: 138, color: "#EAD8C4" },
    ],
  },
  {
    category: "잔향",
    results: [
      { label: "멀리 퍼지는 향", count: 92, color: "#6F4D3F" },
      { label: "주변만 퍼지는 향", count: 118, color: "#CB9C88" },
      { label: "자기만 느끼는 향", count: 64, color: "#EAD8C4" },
    ],
  },
];

export const ReviewDoughnutSection = () => {
  return (
    <section className="grid grid-cols-[max-content_1fr] gap-x-9 gap-y-9 p-9 rounded-xl shadow-card w-full">
      {mockApiResponse.map((item) => (
        <DoughnutChart
          key={item.category}
          centerText={item.category}
          data={item.results.map((r) => ({
            label: r.label,
            value: r.count,
            color: r.color,
          }))}
        />
      ))}
    </section>
  );
};
