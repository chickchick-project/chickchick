import type { StaticImageData } from "next/image";
import {
  Google,
  Kakao,
  Logo,
  MainButton1,
  MainButton2,
  Naver,
  Profile,
} from "../../../public/images/images";

type TImage = {
  src: StaticImageData;
  alt: string;
};

const IMAGES: { [key: string]: TImage } = {
  Profile: { src: Profile, alt: "profile" },
  Logo: { src: Logo, alt: "logo" },
  Google: { src: Google, alt: "google" },
  Naver: { src: Naver, alt: "naver" },
  Kakao: { src: Kakao, alt: "kakao" },
  SearchButton: { src: MainButton1, alt: "search button" },
  RecommendButton: { src: MainButton2, alt: "recommend button" },
};

export default IMAGES;
