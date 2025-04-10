import { ReactNode } from "react";
import { useTotalStore } from "@/lib/stores/useCountStore";
import { ButtonFilledPrimaryLFull } from "@/components/commons/button/ButtonFilled";
import { ButtonOutlinedPrimaryLFull } from "@/components/commons/button/ButtonOutlined";

interface FilterModalLayoutProps {
  title: string;
  note?: string;
  onReset: () => void;
  onSubmit: () => void;
  children: ReactNode;
}

export function FilterModalLayout({
  title,
  note,
  onReset,
  onSubmit,
  children,
}: FilterModalLayoutProps) {
  const totalCount = useTotalStore((state) => state.totalCount);

  return (
    <section className="bg-white w-[640px] p-5 border rounded-xl">
      <header className="flex items-center mb-5 gap-1">
        <h2 className="text-title-1 font-semibold">{title}</h2>
        {note && (
          <span className="text-gray-100 text-label-1 font-medium">{note}</span>
        )}
      </header>
      <div className="flex flex-wrap gap-1 max-h-[40vh] overflow-y-auto">
        {children}
      </div>
      <footer className="flex gap-2 mt-5">
        <ButtonOutlinedPrimaryLFull onClick={onReset}>
          초기화
        </ButtonOutlinedPrimaryLFull>
        <ButtonFilledPrimaryLFull onClick={onSubmit}>
          {`${totalCount}개 검색`}
        </ButtonFilledPrimaryLFull>
      </footer>
    </section>
  );
}
