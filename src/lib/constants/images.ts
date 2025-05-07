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
  Component?: React.FC<React.SVGProps<SVGSVGElement>>;
  alt: string;
};

const IMAGES: { [key: string]: TImage } = {
  Profile: { src: Profile, Component: Profile, alt: "profile" },
  Logo: { src: Logo, Component: Logo, alt: "logo" },
  Google: { src: Google, alt: "google" },
  Naver: { src: Naver, alt: "naver" },
  Kakao: { src: Kakao, alt: "kakao" },
  MainButton1: { src: MainButton1, alt: "main button 1" },
  MainButton2: { src: MainButton2, alt: "main button 2" },
};

export default IMAGES;
