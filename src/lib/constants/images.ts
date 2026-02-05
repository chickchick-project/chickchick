import type { StaticImageData } from "next/image";
import {
  Google,
  Kakao,
  Logo,
  Community,
  Naver,
  PerfumeSearch,
  Profile,
  PlaceHolder,
} from "../../../public/images";

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
  SearchButton: { src: PerfumeSearch, alt: "search button" },
  CommunityButton: { src: Community, alt: "community button" },
  PlaceHolder: { src: PlaceHolder, alt: "place holder" },
};

export default IMAGES;
