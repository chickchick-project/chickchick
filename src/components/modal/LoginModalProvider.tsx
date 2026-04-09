"use client";

import { useState, useEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { useModalStore } from "@/client/stores/uiStore";
import { LoginModal } from "@/components/modal/LoginModal";
import { NicknameSetupModal } from "@/components/modal/NicknameSetupModal";
import { MODAL_KEYS } from "@/client/stores/uiStore";
import { useUserProfile } from "@/client/hooks/query/useUserQuery";

export default function LoginModalProvider() {
  const { loginModal, closeModal } = useModalStore();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [nicknameModalClosed, setNicknameModalClosed] = useState(false);

  const isNewUser = status === "authenticated" && session?.user?.isNewUser === true;
  const { data: profile } = useUserProfile({ enabled: isNewUser });

  useEffect(() => {
    setMounted(true);
  }, []);

  // isNewUser가 false로 바뀌면(세션 업데이트) 닫힌 상태 초기화
  useEffect(() => {
    if (!isNewUser) setNicknameModalClosed(false);
  }, [isNewUser]);

  if (!mounted) return null;

  const modalRoot = document.getElementById("modal");
  if (!modalRoot) return null;

  if (isNewUser && !nicknameModalClosed && profile?.nickname) {
    return createPortal(
      <NicknameSetupModal
        defaultNickname={profile.nickname}
        closeModal={() => setNicknameModalClosed(true)}
      />,
      modalRoot,
    );
  }

  if (!loginModal) return null;

  return createPortal(
    <Suspense fallback={null}>
      <LoginModal closeModal={() => closeModal(MODAL_KEYS.LOGIN)} />
    </Suspense>,
    modalRoot,
  );
}
