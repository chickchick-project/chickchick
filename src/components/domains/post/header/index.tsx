import CautionCard from "./CautionCard";

export default function Header() {
  return (
    <header className="w-full my-10">
      <h1 className="mb-10 text-black-100 font-bold text-headline-2 tablet:text-headline-1 text-center">
        글 작성
      </h1>
      <CautionCard />
    </header>
  );
}
