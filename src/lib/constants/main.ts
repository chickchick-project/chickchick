import type { StaticImageData } from "next/image";
import IMAGES from "@/lib/constants/images";

interface MainButton {
  link: string;
  title: string;
  linkText: string;
  bgImage: {
    src: StaticImageData;
    alt: string;
  };
}

export const MAIN_BUTTONS: MainButton[] = [
  {
    link: "/perfumes",
    title: "원하는 향수를\n찾아보세요!",
    linkText: "향수 검색페이지로 이동하기 ->",
    bgImage: IMAGES.SearchButton,
  },
  {
    link: "/community",
    title: "내가 좋아하는 향을\n추천해보세요!",
    linkText: "커뮤니티 페이지로 이동하기 ->",
    bgImage: IMAGES.CommunityButton,
  },
];
