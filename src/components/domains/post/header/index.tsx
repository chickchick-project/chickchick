import CautionCard from "./CautionCard";

export default function Header({ type }: { type: "edit" | "create" }) {
  return (
    <header className="w-full mt-6  tablet:my-10">
      <h1 className="mb-10 text-black-100 font-bold text-headline-2 tablet:text-headline-1 text-center">
        글 {type === "create" ? "작성" : "수정"}
      </h1>
      <CautionCard />
    </header>
  );
}
