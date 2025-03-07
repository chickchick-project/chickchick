"use client";

import { ModalContainer } from "@/components/modal/ModalContainer";
import { googleLogin, kakaoLogin, logout, naverLogin } from "@/lib/database/action/login";
import { useState } from "react";

export default function LoginTestPage() {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal((prev) => !prev);
  };
  return (
    <>
      <button onClick={handleOpenModal}>login modal button</button>
      {openModal && (
        <ModalContainer>
          <div className="flex justify-center items-center gap-7 w-[444px] h-[308px]">
            {/* naver */}
            <form action={naverLogin}>
              <button>naver</button>
            </form>
            {/* google */}
            <form action={googleLogin}>
              <button>google</button>
            </form>
            {/* kakao: email 받아오는 권한 없음. 보류 */}
            <form action={kakaoLogin}>
              <button>kakao</button>
            </form>
            {/* logout */}
            <form action={logout}>
              <button>logout</button>
            </form>
          </div>
        </ModalContainer>
      )}
    </>
  );
}
