import { DoughnutChart } from "./DoughnutChart";

export const ReviewDoughnutSection = () => {
  return (
    <DoughnutChart
      data={[
        { label: "최고예요", value: 50, color: "#6F4D3F" },
        { label: "좋아요", value: 30, color: "#A47764" },
        { label: "괜찮아요", value: 154, color: "#CB9C88" },
        { label: "별로예요", value: 3, color: "#DBC0B0" },
        { label: "싫어요", value: 50, color: "#EAD8C4" },
      ]}
      centerText="만족도"
    />
  );
};
