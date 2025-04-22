import IMAGES from "@/lib/constants/images";
import Link from "next/link";

interface IMaincontentButtonProps {
  link: string;
  title: string | JSX.Element;
  linkText: string | JSX.Element;
  bgImage?: string;
}

export const MainContentButton = ({
  link,
  title,
  linkText,
  bgImage,
}: IMaincontentButtonProps) => {
  return (
    <Link
      href={link}
      className="w-[340px] h-[200px] bg-neutral-100 rounded-xl inline-flex flex-col justify-start items-start gap-12 "
    >
      <div
        className="w-full h-full rounded-xl flex flex-col justify-between items-start flex-1 p-8 overflow-hidden relative"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full h-full absolute top-0 left-0 self-stretchs bg-gradient-to-l from-black-100/30 to-[#000]/50 rounded-xl" />
        <div className=" text-white text-headline-2 font-semibold z-10 whitespace-pre-line">
          {title}
        </div>
        <div className="text-right  text-white font-semibold z-10">
          {linkText}
        </div>
      </div>
    </Link>
  );
};

export const MainContentButtons = () => {
  return (
    <div className="flex gap-7">
      <MainContentButton
        link="/perfumes"
        title={
          <>
            원하는 향수를
            <br />
            찾아보세요!
          </>
        }
        linkText="향수 검색페이지로 이동하기 ->"
        bgImage={IMAGES.MainButton1.src.src}
      />
      <MainContentButton
        link="/community"
        title={
          <>
            내가 좋아하는 향을
            <br />
            추천해보세요!
          </>
        }
        linkText="커뮤니티 페이지로 이동하기 ->"
        bgImage={IMAGES.MainButton2.src.src}
      />
    </div>
  );
};
