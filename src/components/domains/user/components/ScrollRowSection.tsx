import Image from "next/image";
import ICONS from "@/shared/constants/icons";

export const ScrollRowSection = ({
  title,
  children,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  title: string;
  children: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-y-5">
      <span className="text-headline-2 font-semibold ml-4 tablet:ml-[50px]">
        {title}
      </span>
      <div className="w-full flex justify-center">
        <div className="relative w-fit">
          {hasPrev && (
            <button
              onClick={onPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full ml-[-20px] z-10 p-2 rounded-full hover:bg-gray-100"
              aria-label="이전 게시글 보기"
            >
              <Image
                src={ICONS.ArrowDownGray.src}
                width={36}
                height={36}
                alt="left"
                className="rotate-90"
              />
            </button>
          )}

          {children}

          {hasNext && (
            <button
              onClick={onNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full mr-[-20px] z-10 p-2 rounded-full hover:bg-gray-100"
              aria-label="다음 게시글 보기"
            >
              <Image
                src={ICONS.ArrowDownGray.src}
                width={36}
                height={36}
                alt="right"
                className="rotate-[270deg]"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
