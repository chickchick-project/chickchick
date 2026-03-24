"use client";

import {
  googleLogin,
  kakaoLogin,
  naverLogin,
} from "@/server/database/action/login";
import { ModalContainer } from "./ModalContainer";
import Image from "next/image";
import IMAGES from "@/shared/constants/images";
import { SocialLogoContainer } from "../commons/socialLogo/SocialLogoContainer";
import { usePathname, useSearchParams } from "next/navigation";

interface ILoginModalProps {
  closeModal: () => void;
}

export const LoginModal = ({ closeModal }: ILoginModalProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || pathname;

  const handleGoogleLogin = googleLogin.bind(null, callbackUrl);
  const handleNaverLogin = naverLogin.bind(null, callbackUrl);
  const handleKakaoLogin = kakaoLogin.bind(null, callbackUrl);

  return (
    <ModalContainer closeModal={closeModal}>
      <div className="flex flex-col justify-center items-center gap-7 w-[444px] h-[308px]">
        <Image
          src={IMAGES.Logo.src}
          alt={IMAGES.Logo.alt}
          width={120}
          height={44}
        />
        <div className="text-black-300 font-normal text-lg">
          로그인 / 회원가입
        </div>
        <div className="flex justify-center items-center gap-6">
          {/* google */}
          <form action={handleGoogleLogin}>
            <button>
              <SocialLogoContainer>
                <Image
                  src={IMAGES.Google.src}
                  alt={IMAGES.Google.alt}
                  width={32}
                  height={32}
                />
              </SocialLogoContainer>
            </button>
          </form>

          {/* naver */}
          <form action={handleNaverLogin}>
            <button>
              <SocialLogoContainer>
                <Image
                  src={IMAGES.Naver.src}
                  alt={IMAGES.Naver.alt}
                  width={48.96}
                  height={48.96}
                />
              </SocialLogoContainer>
            </button>
          </form>

          {/* kakao: email 받아오는 권한 없음. 보류 */}
          <form action={handleKakaoLogin}>
            <button>
              <SocialLogoContainer>
                <Image
                  src={IMAGES.Kakao.src}
                  alt={IMAGES.Kakao.alt}
                  width={32}
                  height={32}
                />
              </SocialLogoContainer>
            </button>
          </form>
          {/* logout */}
          {/* <form action={logout}>
            <button>logout</button>
          </form> */}
        </div>
      </div>
    </ModalContainer>
  );
};
