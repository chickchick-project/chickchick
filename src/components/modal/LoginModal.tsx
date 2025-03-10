import { googleLogin, kakaoLogin, logout, naverLogin } from "@/lib/database/action/login";
import { ModalContainer } from "./ModalContainer";
import Image from "next/image";
import IMAGES from "@/lib/constants/images";
import { SocialLogoContainer } from "../commons/socialLogo/SocialLogoContainer";

export const LoginModal = () => {
  return (
    <ModalContainer>
      <div className="flex flex-col justify-center items-center gap-7 w-[444px] h-[308px]">
        <Image src={IMAGES.Logo.src} alt={IMAGES.Logo.alt} width={120} height={44} />
        <div className="text-black-300 font-normal text-lg">로그인 / 회원가입</div>
        <div className="flex justify-center items-center gap-6">
          {/* google */}
          <form action={googleLogin}>
            <button>
              <SocialLogoContainer>
                <Image src={IMAGES.Google.src} alt={IMAGES.Google.alt} width={32} height={32} />
              </SocialLogoContainer>
            </button>
          </form>

          {/* naver */}
          <form action={naverLogin}>
            <button>
              <SocialLogoContainer>
                <Image src={IMAGES.Naver.src} alt={IMAGES.Naver.alt} width={48.96} height={48.96} />
              </SocialLogoContainer>
            </button>
          </form>

          {/* kakao: email 받아오는 권한 없음. 보류 */}
          <form action={kakaoLogin}>
            <button>
              <SocialLogoContainer>
                <Image src={IMAGES.Kakao.src} alt={IMAGES.Kakao.alt} width={32} height={32} />
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
