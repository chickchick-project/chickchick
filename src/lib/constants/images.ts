import type { StaticImageData } from "next/image";
import { Google, Kakao, Logo, Naver, Profile } from "../../../public/images/images";

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
};

export default IMAGES;
