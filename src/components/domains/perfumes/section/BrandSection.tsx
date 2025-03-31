import Image from "next/image";

export const BrandSection = ({ brandName }: { brandName: string }) => {
  return (
    <section className="mt-10 px-4">
      <h3 className="text-headline-3 font-semibold">브랜드</h3>
      <div className="flex border p-5 my-5 gap-6 items-center rounded-xl">
        <Image
          src="/images/Logo.svg" // 임시
          alt="브랜드 로고"
          width={160}
          height={68}
          placeholder="blur"
          blurDataURL="/images/BlurShimmer.svg"
        />
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <span className="text-label-2 font-medium text-black-300">
              브랜드관
            </span>
            <span className="text-title-2 font-semibold text-black-100">
              {brandName} 바로가기
            </span>
          </div>
          <div>&gt;</div>
        </div>
      </div>
    </section>
  );
};
