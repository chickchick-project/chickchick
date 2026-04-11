"use client";

type BarListProps = {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  maxCap?: number;
};

const formatValue = (v: number, cap = 999) => (v > cap ? `${cap}+` : `${v}`);

export function MobileBarChart({ data, maxCap = 999 }: BarListProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <ul className="flex flex-col gap-2 w-full">
      {data.map((item) => {
        const isTop = item.value === maxValue;
        const percent = Math.max(3, Math.round((item.value / maxValue) * 100));
        const barColor = isTop ? item.color : "#D4D4D8";
        const labelClass = isTop ? "text-black-100" : "text-black-300";
        const valueClass = isTop ? "text-black-100" : "text-black-300";

        return (
          <li
            key={item.label}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
          >
            <span
              className={`text-label-2 font-medium w-[79px] block ${labelClass}`}
            >
              {item.label}
            </span>

            <div className="relative h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-[width]"
                style={{ width: `${percent}%`, background: barColor }}
              />
            </div>

            <span className={`text-label-3 font-medium ${valueClass}`}>
              {formatValue(item.value, maxCap)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
